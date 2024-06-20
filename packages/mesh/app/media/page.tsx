import { headers } from 'next/headers'
import { notFound } from 'next/navigation'

import { RESTFUL_ENDPOINTS, STATIC_FILE_ENDPOINTS } from '@/constants/config'
import {
  type LatestStoriesQuery,
  type PublishersQuery,
  GetMemberDocument,
} from '@/graphql/__generated__/graphql'
import fetchGraphQL from '@/utils/fetch-graphql'
import fetchRestful from '@/utils/fetch-restful'
import fetchStatic from '@/utils/fetch-static'
import { getLogTraceObject, logServerSideError } from '@/utils/log'

import CategorySelector from './_components/category-selector'
import Media from './_components/media'

export const revalidate = 0
export type Story = NonNullable<LatestStoriesQuery['stories']>[number]
export type Publisher = NonNullable<PublishersQuery['publishers']>[number]
type LatestStoriesResponse = {
  update_time: number
  expire_time: number
  num_stories: number
  stories: Story[]
}

export default async function Page() {
  const headersList = headers()
  const globalLogFields = getLogTraceObject(headersList)

  const memberId = '19'

  const data = await fetchGraphQL(
    GetMemberDocument,
    {
      memberId,
    },
    globalLogFields
  )

  if (!data) {
    return notFound()
  }

  const followingPublishers =
    data.member?.followPublishers?.map((publiser) => publiser.id) ?? []
  const firstCategory = data.member?.followingCategories?.[0]
  const followingMemberIds = new Set(
    data.member?.followingMembers?.map((member) => member.id ?? '')
  )

  const mediaCount = 5
  const latestStoryPageCount = 20
  let stories: Story[] = []
  let mostPickedStory: Story | null | undefined
  let publishers: Publisher[] = []

  let responses: [
    LatestStoriesResponse | null,
    Story[] | null,
    Publisher[] | null
  ]
  try {
    responses = await Promise.all([
      fetchRestful<LatestStoriesResponse>(
        RESTFUL_ENDPOINTS.latestStories,
        {
          publishers: followingPublishers,
          category: firstCategory?.id ?? '',
          index: 0,
          take: latestStoryPageCount,
        },
        {
          next: { revalidate },
        },
        globalLogFields
      ),
      fetchStatic<Story[]>(
        STATIC_FILE_ENDPOINTS.mostPickStoriesInCategoryFn(
          firstCategory?.slug ?? ''
        ),
        {
          next: { revalidate: 10 },
        },
        globalLogFields
      ),
      fetchStatic<Publisher[]>(
        STATIC_FILE_ENDPOINTS.mostSponsorPublishers,
        {
          next: { revalidate: 10 },
        },
        globalLogFields
      ),
    ])
  } catch (error) {
    logServerSideError(error, 'Unhandled error in media page', globalLogFields)
    responses = [null, null, null]
  }

  mostPickedStory = responses[1]?.[0]
  stories =
    responses[0]?.stories?.filter(
      (story) => story.id !== mostPickedStory?.id
    ) ?? []
  publishers = responses[2]?.slice(0, mediaCount) ?? []

  // TODO: fetch real publiser stories
  const displayPublishers = publishers.map((publisher) => ({
    ...publisher,
    stories: stories?.slice(0, 3) ?? [],
  }))

  return (
    <main className="bg-white">
      <CategorySelector />
      <Media
        stories={stories}
        mostPickedStory={mostPickedStory}
        displayPublishers={displayPublishers}
        followingMemberIds={followingMemberIds}
      />
    </main>
  )
}
