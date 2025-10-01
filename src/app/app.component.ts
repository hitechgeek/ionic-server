import { Component } from '@angular/core';
// import { BiometryType, NativeBiometric } from 'capacitor-native-biometric';
import {
  Camera,
  CameraDirection,
  CameraResultType,
  CameraSource,
} from '@capacitor/camera';
import {
  NativeBiometric,
  BiometryType,
} from '@capgo/capacitor-native-biometric';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public isVerified = false;
  public colorChange = false;
  public imageElement: any;
  constructor() {
    this.checkStatus();
  }

  public async checkStatus() {
    const result = await NativeBiometric.isAvailable();
    if (!result.isAvailable) return;
    const isFingerprint = result.biometryType == BiometryType.FINGERPRINT;
    console.log(isFingerprint);
    result.errorCode == BiometryType.FINGERPRINT;
    const verified = await NativeBiometric.verifyIdentity({
      reason: 'For easy log in',
      title: 'Log in',
      subtitle: 'Maybe add subtitle here?',
      description: 'Maybe a description too?',
      negativeButtonText: 'USE PIN',
      maxAttempts: 5,
      useFallback: true,
    })
      .then(() => true)
      .catch(() => false);

    if (verified) {
      this.isVerified = true;
    } else {
      this.colorChange = true;
    }
    // if (!verified) return;

    const credentials = await NativeBiometric.getCredentials({
      server: 'www.example.com',
    });

    console.log(credentials);

    // Save user's credentials
    NativeBiometric.setCredentials({
      username: 'username',
      password: 'password',
      server: 'www.example.com',
    }).then();

    // Delete user's credentials
    NativeBiometric.deleteCredentials({
      server: 'www.example.com',
    }).then();
  }

  takePicture = async () => {
    const permission = await Camera.checkPermissions();
    if (permission.camera == 'prompt-with-rationale') {
      await Camera.requestPermissions({ permissions: ['camera', 'photos'] });
    }
    await Camera.requestPermissions({ permissions: ['camera', 'photos'] });
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri,
      source: CameraSource.Prompt,
      direction: CameraDirection.Front,
      presentationStyle: 'fullscreen',
    });

    this.imageElement = image.webPath;

    // const image = await Camera.getPhoto({
    //   quality: 90,
    //   allowEditing: true,
    //   resultType: CameraResultType.Uri,
    // });

    // // image.webPath will contain a path that can be set as an image src.
    // // You can access the original file using image.path, which can be
    // // passed to the Filesystem API to read the raw data of the image,
    // // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
    // var imageUrl = image.webPath;

    // // Can be set to the src of an image now
    // imageElement.src = imageUrl;
  };

  generateRandomColours() {
    setInterval(() => {
      const red = Math.floor(Math.random() * 256); // Random value between 0 and 255
      const green = Math.floor(Math.random() * 256); // Random value between 0 and 255
      const blue = Math.floor(Math.random() * 256); // Random value between 0 and 255

      // Create a CSS color string in the format "rgb(red, green, blue)"
      const color = `rgb(${red}, ${green}, ${blue})`;
      console.log(color);
      const myElement = document.getElementById('body');
      if (myElement) {
        // Access the style property of the element to set CSS properties
        myElement.style.backgroundColor = color; // Set background color
      }
      return color;
    }, 1000); // the timer has been increased
  }
}
