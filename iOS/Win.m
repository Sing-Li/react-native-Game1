//
//  Win.m
//  Game1
//
//  Created by S Li on 6/19/15.
//

#import "Win.h"
#import <CloudantToolkit/CloudantToolkit.h>
#import <CloudantSync.h>
#import <IMFData/IMFData.h>

@implementation Win
RCT_EXPORT_MODULE();

- (instancetype)initWithDevicid:(NSString *)deviceid timestamp:(NSString *)timestamp firstval:(NSString *)firstval secondval:(NSString *)secondval sincelast: (NSInteger) sincelast cheated:(NSInteger)cheated
{
  if ((self = [super init])) {
    _deviceid = deviceid;
    _timestamp = timestamp;
    _firstval = firstval;
    _secondval = secondval;
    _cheated = cheated;
    _sincelast = sincelast;
  }
  
  return self;
}

RCT_EXPORT_METHOD(notifyWin: (NSString*) timestamp  firstval: (NSString*) firstval secondval: (NSString*) secondval sincelast:(NSInteger) sincelast  cheated: (NSInteger) cheated)
{
  
  IMFDataManager *manager =
  [IMFDataManager sharedInstance];
  
  NSString *name = @"gamedb";
  NSError *error = nil;
  
  //Create local store
  CDTStore *store = [manager localStore:name error:&error];
  
  
  [store.mapper setDataType:@"Win" forClassName:NSStringFromClass([Win class])];
  // get uuid
  NSString *uuid = [[UIDevice currentDevice] identifierForVendor].UUIDString;
  
  Win *winning = [[Win alloc] initWithDevicid:uuid timestamp:timestamp firstval:firstval secondval:secondval sincelast:sincelast cheated: cheated ];
  
  
  
  [store save:winning completionHandler:^(id savedObject, NSError *error) {
    if (error) {
      // save was not successful, handler received an error
    } else {
      // use the result
      Win *savedWin = savedObject;
      NSLog(@"saved revision: %@", savedWin);
    }
  }];
  
  
  __block NSError *replicationError;
  CDTPushReplication *push = [manager pushReplicationForStore: store.name];
  CDTReplicator *replicator = [manager.replicatorFactory oneWay:push error:&replicationError];
  if(replicationError){
    // Handle error
  }else{
    // replicator creation was successful
  }
  
  [replicator startWithError:&replicationError];
  if(replicationError){
    // Handle error
  }else{
    // replicator start was successful
  }
  
  // (optionally) monitor replication via polling
  while (replicator.isActive) {
    [NSThread sleepForTimeInterval:1.0f];
    NSLog(@"replicator state : %@", [CDTReplicator stringForReplicatorState:replicator.state]);
  }
  

  
}

@end
