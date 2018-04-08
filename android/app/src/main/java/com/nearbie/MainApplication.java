package com.nearbie;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.brentvatne.react.ReactVideoPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.azendoo.reactnativesnackbar.SnackbarPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.arttitude360.reactnative.rngoogleplaces.RNGooglePlacesPackage;
import com.rnfs.RNFSPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.dylanvann.fastimage.FastImageViewPackage;
import org.reactnative.camera.RNCameraPackage;
import com.airbnb.android.react.lottie.LottiePackage;
import com.brentvatne.react.ReactVideoPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.azendoo.reactnativesnackbar.SnackbarPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.arttitude360.reactnative.rngoogleplaces.RNGooglePlacesPackage;
import com.rnfs.RNFSPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.dylanvann.fastimage.FastImageViewPackage;
import org.reactnative.camera.RNCameraPackage;
import com.airbnb.android.react.lottie.LottiePackage;
import com.brentvatne.react.ReactVideoPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.azendoo.reactnativesnackbar.SnackbarPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.arttitude360.reactnative.rngoogleplaces.RNGooglePlacesPackage;
import com.rnfs.RNFSPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.dylanvann.fastimage.FastImageViewPackage;
import org.reactnative.camera.RNCameraPackage;
import com.airbnb.android.react.lottie.LottiePackage;
import com.brentvatne.react.ReactVideoPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.azendoo.reactnativesnackbar.SnackbarPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.arttitude360.reactnative.rngoogleplaces.RNGooglePlacesPackage;
import com.rnfs.RNFSPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.dylanvann.fastimage.FastImageViewPackage;
import org.reactnative.camera.RNCameraPackage;
import com.airbnb.android.react.lottie.LottiePackage;
import com.brentvatne.react.ReactVideoPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.azendoo.reactnativesnackbar.SnackbarPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.arttitude360.reactnative.rngoogleplaces.RNGooglePlacesPackage;
import com.rnfs.RNFSPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.dylanvann.fastimage.FastImageViewPackage;
import org.reactnative.camera.RNCameraPackage;
import com.airbnb.android.react.lottie.LottiePackage;
import com.brentvatne.react.ReactVideoPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.azendoo.reactnativesnackbar.SnackbarPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.arttitude360.reactnative.rngoogleplaces.RNGooglePlacesPackage;
import com.rnfs.RNFSPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.dylanvann.fastimage.FastImageViewPackage;
import org.reactnative.camera.RNCameraPackage;
import com.airbnb.android.react.lottie.LottiePackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new ReactVideoPackage(),
            new VectorIconsPackage(),
            new SnackbarPackage(),
            new MapsPackage(),
            new RNGooglePlacesPackage(),
            new RNFSPackage(),
            new RNFetchBlobPackage(),
            new FastImageViewPackage(),
            new RNCameraPackage(),
            new LottiePackage(),
            new ReactVideoPackage(),
            new VectorIconsPackage(),
            new SnackbarPackage(),
            new MapsPackage(),
            new RNGooglePlacesPackage(),
            new RNFSPackage(),
            new RNFetchBlobPackage(),
            new FastImageViewPackage(),
            new RNCameraPackage(),
            new LottiePackage(),
            new ReactVideoPackage(),
            new VectorIconsPackage(),
            new SnackbarPackage(),
            new MapsPackage(),
            new RNGooglePlacesPackage(),
            new RNFSPackage(),
            new RNFetchBlobPackage(),
            new FastImageViewPackage(),
            new RNCameraPackage(),
            new LottiePackage(),
            new ReactVideoPackage(),
            new VectorIconsPackage(),
            new SnackbarPackage(),
            new MapsPackage(),
            new RNGooglePlacesPackage(),
            new RNFSPackage(),
            new RNFetchBlobPackage(),
            new FastImageViewPackage(),
            new RNCameraPackage(),
            new LottiePackage(),
            new ReactVideoPackage(),
            new VectorIconsPackage(),
            new SnackbarPackage(),
            new MapsPackage(),
            new RNGooglePlacesPackage(),
            new RNFSPackage(),
            new RNFetchBlobPackage(),
            new FastImageViewPackage(),
            new RNCameraPackage(),
            new LottiePackage(),
            new ReactVideoPackage(),
            new VectorIconsPackage(),
            new SnackbarPackage(),
            new MapsPackage(),
            new RNGooglePlacesPackage(),
            new RNFSPackage(),
            new RNFetchBlobPackage(),
            new FastImageViewPackage(),
            new RNCameraPackage(),
            new LottiePackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
