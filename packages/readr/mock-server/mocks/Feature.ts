import { faker } from '@faker-js/faker'

import type { GenericFeature } from '../../types/common'
import { randomBoolean } from '../utils'

export const Feature: () => GenericFeature = () => ({
  description: randomBoolean()
    ? `${faker.internet.emoji()} ${faker.lorem.slug(2)}`
    : '',
  featurePost: [...new Array(1)],
})
