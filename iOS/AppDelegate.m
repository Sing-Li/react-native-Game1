/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"
#import <IMFCore/IMFCore.h>

#import "RCTRootView.h"
#import "Win.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{

  
  NSURL *jsCodeLocation;

  /**
   * Loading JavaScript code - uncomment the one you want.
   *
   * OPTION 1
   * Load from development server. Start the server from the repository root:
   *
   * $ npm start
   *
   * To run on device, change `localhost` to the IP address of your computer
   * (you can get this by typing `ifconfig` into the terminal and selecting the
   * `inet` value under `en0:`) and make sure your computer and iOS device are
   * on the same Wi-Fi network.
   */

  jsCodeLocation = [NSURL URLWithString:@"http://192.168.38.102:8081/index.ios.bundle"];

  /**
   * OPTION 2
   * Load from pre-bundled file on disk. To re-generate the static bundle
   * from the root of your project directory, run
   *
   * $ react-native bundle --minify
   *
   * see http://facebook.github.io/react-native/docs/runningondevice.html
   */

//   jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"Game1"
                                                   launchOptions:launchOptions];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [[UIViewController alloc] init];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];

// uncomment next line if you need CMD-R JS reload during UI development
#define REACT_NATIVE_UI_DEBUG
  
  // initialize SDK with IBM Bluemix application ID and route
  IMFClient *imfClient = [IMFClient sharedInstance];
  [imfClient
   initializeWithBackendRoute:@"https://yourappname.mybluemix.net"
   backendGUID:@"04-REPLACE-WITH-YOUR-GUID-e47"];
  
 #ifndef REACT_NATIVE_UI_DEBUG
  [IMFLogger captureUncaughtExceptions];
  
  // change the verbosity filter to "debug and above"
  
  [IMFLogger setLogLevel:IMFLogLevelDebug];
  
  // create a logger instance
  IMFLogger *logger = [IMFLogger loggerForName:@"AppDelegate"];
  
  // log a message
  [logger logDebugWithMessages:@"Startup message for Game1."];
  
  IMFAuthorizationManager *authManager = [IMFAuthorizationManager sharedInstance];
  [authManager obtainAuthorizationHeaderWithCompletionHandler:^(IMFResponse *response, NSError *error) {
    if (error==nil)
    {
      NSLog(@"You have connected to Bluemix successfully");
      
      
    } else
    {
      NSLog(@"%@",error);
      if (error.localizedDescription!=nil){
        NSString *errorMsg =  [NSString stringWithFormat: @"%@ Please verify the Bundle Identifier, Bundle Version, ApplicationRoute and ApplicationID.", error.localizedDescription];
      }
    }
    
  }];
  [IMFLogger send];

#endif
  
    return YES;
}

@end
