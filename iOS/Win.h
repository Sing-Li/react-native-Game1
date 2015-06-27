//
//  Win.h
//  Game1
//
//

#import <CloudantToolkit/CloudantToolkit.h>
#import "RCTBridgeModule.h"

@interface Win : NSObject <CDTDataObject, RCTBridgeModule>
@property(strong,nonatomic,readwrite) CDTDataObjectMetadata *metadata;

@property NSString *timestamp;
@property NSString *firstval;
@property NSString *secondval;
@property NSInteger cheated;
@property NSString *deviceid;
@property NSInteger sincelast;

-(instancetype) initWithDevicid: (NSString*) deviceid timestamp: (NSString*) timestamp firstval: (NSString*) firstval secondval: (NSString*) secondval sincelast: (NSInteger) sincelast cheated: (NSInteger) cheated;
@end
