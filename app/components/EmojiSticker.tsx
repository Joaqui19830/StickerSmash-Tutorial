import { type ImageSource } from 'expo-image';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

type Props = {
  imageSize: number;
  stickerSource: ImageSource;
};

export default function EmojiSticker({ imageSize, stickerSource }: Props) {

  const scaleImage = useSharedValue(imageSize);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const doubleTap = Gesture.Tap()
  .numberOfTaps(2)
  .onStart(() => {
    if (scaleImage.value !== imageSize * 2) {
      scaleImage.value = scaleImage.value * 2;
    } else {
      scaleImage.value = Math.round(scaleImage.value / 2);
    }
  });

  const imageStyle = useAnimatedStyle(() => {
    return {
      width: withSpring(scaleImage.value),
      height: withSpring(scaleImage.value),
    };
  });


  // Este es para realizar el desplazamiendo y el de arriba es como que hace un zoom al tocarla 2 veces
  const drag = Gesture.Pan().onChange(event => {
    translateX.value += event.changeX;
    translateY.value += event.changeY;
  });

  const containerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value,
        },
        {
          translateY: translateY.value,
        },
      ],
    };
  });
  


  return (
    // Este es para desplazar el sticker
    <GestureDetector gesture={drag}>

    <Animated.View style={[containerStyle, { top: -350 }]}>
    {/* // Este es para hacerle zoom al sticker */}
      <GestureDetector gesture={doubleTap}>

      <Animated.Image source={stickerSource} resizeMode='contain' style={[ imageStyle, { width: imageSize, height: imageSize }]} />
      </GestureDetector>
    </Animated.View>
    </GestureDetector>
  );
}
