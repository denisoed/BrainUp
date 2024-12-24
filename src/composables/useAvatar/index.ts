import { mouthTypes } from '@/composables/useAvatar/AssetsTypes/mouth'
import { eyeTypes } from '@/composables/useAvatar/AssetsTypes/eyes'
import { eyebrowTypes } from '@/composables/useAvatar/AssetsTypes/eyebrows'
import { clothesType } from '@/composables/useAvatar/AssetsTypes/clothes'
import { topTypes } from '@/composables/useAvatar/AssetsTypes/top'
import { accessoriesTypes } from '@/composables/useAvatar/AssetsTypes/accessories'
import { facialHairTypes } from '@/composables/useAvatar/AssetsTypes/facial-hair'
import { GraphicShirtTypes } from '@/composables/useAvatar/AssetsTypes/graphic-shirt'
import {
  hairColors,
  skinColors,
  hatAndShirtColors,
  circleColors
} from '@/composables/useAvatar/AssetsTypes/colors'

const useAvatar = () => {
  function getRandomChoice(items) {
    const itemsLength = Object.entries(items).length
    return Object.keys(items)[Math.floor((Math.random() * (itemsLength)))]
  }
  
  function getRandomAvatar() {
    return {
      mouth: getRandomChoice(mouthTypes),
      eyes: getRandomChoice(eyeTypes),
      eyebrows: getRandomChoice(eyebrowTypes),
      top: getRandomChoice(topTypes),
      accessories: getRandomChoice(accessoriesTypes),
      facialHair: getRandomChoice(facialHairTypes),
      clothes: getRandomChoice(clothesType),
      graphic: getRandomChoice(GraphicShirtTypes),
      hairColor: getRandomChoice(hairColors),
      skinColor: getRandomChoice(skinColors),
      hatColor: getRandomChoice(hatAndShirtColors),
      circleColor: getRandomChoice(circleColors)
    }
  }

  return {
    getRandomAvatar,
    getRandomChoice,
  }
};

export default useAvatar;
