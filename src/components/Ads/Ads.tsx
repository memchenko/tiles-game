import React, { useRef, useEffect, useCallback } from 'react';

import { IAdsProps } from './types';
import './Ads.scss';

declare var google: {
    ima: any;
};

export default function Ads(props: IAdsProps) {
    const geometry = useRef<{ width: number; height: number; } | null>(null);
    const container = useRef<any | null>(null);
    const content = useRef<any | null>(null);
    const video = useRef<any | null>(null);
    const intervalTimer = useRef<any | null>(null);
    const adContainer = useRef(null);
    const adDisplayContainer = useRef<any | null>(null);
    const adsManager = useRef<any | null>(null);
    let adsLoader: any;

    const setUpIMA = useCallback(() => {
        debugger;
        // Create the ad display container.
        createAdDisplayContainer();
        // Create ads loader.
        adsLoader = new google.ima.AdsLoader(adDisplayContainer.current);
        // Listen and respond to ads loaded and error events.
        adsLoader.addEventListener(
            google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
            onAdsManagerLoaded,
            false
        );
        adsLoader.addEventListener(
            google.ima.AdErrorEvent.Type.AD_ERROR,
            onAdError,
            false
        );

        // An event listener to tell the SDK that our content video
        // is completed so the SDK can play any post-roll ads.
        var contentEndedListener = function() { adsLoader.contentComplete(); };
        video.current!.onended = contentEndedListener;

        // Request video ads.
        var adsRequest = new google.ima.AdsRequest();
        adsRequest.adTagUrl = 'https://pubads.g.doubleclick.net/gampad/ads?' +
            'sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&' +
            'impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&' +
            'cust_params=deployment%3Ddevsite%26sample_ct%3Dlinear&correlator=';

        // Specify the linear and nonlinear slot sizes. This helps the SDK to
        // select the correct creative if multiple are returned.
        adsRequest.linearAdSlotWidth = geometry.current!.width;
        adsRequest.linearAdSlotHeight = geometry.current!.height;

        adsRequest.nonLinearAdSlotWidth = geometry.current!.width;
        adsRequest.nonLinearAdSlotHeight = geometry.current!.height;

        adsLoader.requestAds(adsRequest);
    }, [adDisplayContainer, geometry, video, adsLoader]);

    const createAdDisplayContainer = useCallback(() => {
        adDisplayContainer.current = new google.ima.AdDisplayContainer(
            adContainer.current,
            video.current
        );
        debugger;
    }, [adDisplayContainer, adContainer, video]);

    const playAds = useCallback(() => {
        // Initialize the container. Must be done via a user action on mobile devices.
        video.current!.load();
        adDisplayContainer.current!.initialize();
      
        try {
          // Initialize the ads manager. Ad rules playlist will start at this time.
          adsManager.current!.init(geometry.current!.width, geometry.current!.height, google.ima.ViewMode.NORMAL);
          // Call play to start showing the ad. Single video and overlay ads will
          // start at this time; the call will be ignored for ad rules.
          adsManager.current!.start();
        } catch (adError) {
          // An error may be thrown if there was a problem with the VAST response.
          video.current!.play();
        }
    }, [video, geometry, adDisplayContainer.current, adsManager]);

    const onAdsManagerLoaded = useCallback((adsManagerLoadedEvent: any) => {
        // Get the ads manager.
        var adsRenderingSettings = new google.ima.AdsRenderingSettings();
        adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete = true;
        // videoContent should be set to the content video element.
        adsManager.current = adsManagerLoadedEvent.getAdsManager(
            video.current!, adsRenderingSettings
        );
      
        // Add listeners to the required events.
        adsManager.current!.addEventListener(
            google.ima.AdErrorEvent.Type.AD_ERROR,
            onAdError
        );
        adsManager.current!.addEventListener(
            google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED,
            onContentPauseRequested
        );
        adsManager.current!.addEventListener(
            google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED,
            onContentResumeRequested
        );
        adsManager.current!.addEventListener(
            google.ima.AdEvent.Type.ALL_ADS_COMPLETED,
            onAdEvent
        );
      
        // Listen to any additional events, if necessary.
        adsManager.current!.addEventListener(
            google.ima.AdEvent.Type.LOADED,
            onAdEvent
        );
        adsManager.current!.addEventListener(
            google.ima.AdEvent.Type.STARTED,
            onAdEvent
        );
        adsManager.current!.addEventListener(
            google.ima.AdEvent.Type.COMPLETE,
            onAdEvent
        );
    }, [adsManager, video]);

    const onAdEvent = useCallback((adEvent) => {
        // Retrieve the ad from the event. Some events (e.g. ALL_ADS_COMPLETED)
        // don't have ad object associated.
        var ad = adEvent.getAd();
        switch (adEvent.type) {
          case google.ima.AdEvent.Type.LOADED:
            // This is the first event sent for an ad - it is possible to
            // determine whether the ad is a video ad or an overlay.
            if (!ad.isLinear()) {
              // Position AdDisplayContainer correctly for overlay.
              // Use ad.width and ad.height.
              video.current!.play();
            }
            break;
          case google.ima.AdEvent.Type.STARTED:
            // This event indicates the ad has started - the video player
            // can adjust the UI, for example display a pause button and
            // remaining time.
            if (ad.isLinear()) {
              // For a linear ad, a timer can be started to poll for
              // the remaining time.
              intervalTimer.current = setInterval(
                  function() {
                    var remainingTime = adsManager.current!.getRemainingTime();
                  },
                  300); // every 300ms
            }
            break;
          case google.ima.AdEvent.Type.COMPLETE:
            // This event indicates the ad has finished - the video player
            // can perform appropriate UI actions, such as removing the timer for
            // remaining time detection.
            if (ad.isLinear()) {
              clearInterval(intervalTimer.current);
            }
            break;
        }
    }, [video, intervalTimer]);

    const onAdError = useCallback((adErrorEvent)  => {
        // Handle the error logging.
        console.log(adErrorEvent.getError());
        adsManager.current!.destroy();
    }, [adsManager]);
      
    const onContentPauseRequested = useCallback(() => {
        video.current!.pause();
        // This function is where you should setup UI for showing ads (e.g.
        // display ad timer countdown, disable seeking etc.)
        // setupUIForAds();
    }, [video]);
      
    const onContentResumeRequested = useCallback(() => {
        video.current!.play();
        // This function is where you should ensure that your UI is ready
        // to play content. It is the responsibility of the Publisher to
        // implement this function when necessary.
        // setupUIForContent();
    }, [video]);

    useEffect(() => {
        if (!container.current || !content.current || !video.current || !adContainer.current) {
            debugger;
            const { width } = video.current.getBoundingClientRect();

            const newHeight = width / 16 * 9;

            video.current.style.height = newHeight + 'px';

            geometry.current = { width, height: newHeight };

            setUpIMA();
        }
    }, [container.current, content.current, video.current, adContainer.current, setUpIMA, playAds]);

    return (
        <div ref={ container } className="ads">
            <div ref={ content } className="ads__content">
                <video ref={ video } className="ads__video">
                    <source src="https://storage.googleapis.com/gvabox/media/samples/stock.mp4"></source>
                </video>
            </div>
            <div ref={ adContainer } className="ads__ads-container"></div>
            <button onClick={ playAds }>click</button>
        </div>
    );
}
