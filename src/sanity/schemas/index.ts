import { siteSettings } from './siteSettings'
import { navigation } from './navigation'
import { homePage } from './homePage'
import { wine } from './wine'
import { menuCategory } from './menuCategory'
import { menuItem } from './menuItem'
import { event } from './event'
import { teamMember } from './teamMember'
import { page } from './page'

export const schemaTypes = [
  // Singletons
  siteSettings,
  navigation,
  homePage,
  // Documents
  wine,
  menuCategory,
  menuItem,
  event,
  teamMember,
  page,
]
