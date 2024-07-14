import Image from 'next/image'

import Comment, { type CommentType } from '@/app/profile/_components/comment'
import Icon from '@/components/icon'
import StoryMeta from '@/components/story-card/story-meta'
import StoryPickButton from '@/components/story-card/story-pick-button'
import StoryPickInfo from '@/components/story-card/story-pick-info'
import { type GetMemberProfileQuery } from '@/graphql/__generated__/graphql'
import { TabCategory } from '@/types/tab'

type Member = GetMemberProfileQuery['member']
type PickList = NonNullable<Member>['picks']

export type StoryData = NonNullable<PickList>[number]['story']
type ArticleCardProps = {
  storyData: NonNullable<StoryData>
  isLast: boolean
  memberId?: string
  avatar?: string
  category?: TabCategory
  userType: string
  name?: string
}

const ArticleCard = ({
  storyData,
  isLast,
  memberId,
  avatar = '',
  category,
  name,
  userType,
}: ArticleCardProps) => {
  const commentList = storyData.comment || []
  const authorComment =
    commentList.length !== 0
      ? commentList[0]
      : {
          __typename: 'Comment',
          id: '',
          content: '',
          createdAt: '',
          likeCount: 0,
          member: {
            __typename: 'Member',
            id: memberId,
            name,
            avatar,
          },
        }
  const isCommentShow =
    category !== TabCategory.BOOKMARKS && userType !== 'publisher'

  return (
    <>
      <section className="hidden md:block md:aspect-[2/1] md:w-full md:overflow-hidden md:rounded-t-md">
        <Image
          src={storyData.og_image || '/images/default-story-image.webP'}
          alt={`${storyData.title}'s story cover image`}
          width={96}
          height={48}
          className="h-full w-full object-cover"
        />
      </section>
      <div
        className={`flex flex-col p-5 after:absolute after:bottom-1 after:h-[1px] after:w-[calc(100%-40px)] after:bg-primary-200 md:line-clamp-3 md:pt-[12px] md:after:hidden ${
          isLast && 'after:hidden'
        }`}
      >
        <section className="mb-1 flex items-center justify-between">
          <p className="caption-1 text-primary-500">
            {(storyData.source && storyData.source.title) ?? ''}
          </p>
          <Icon iconName="icon-more-horiz" size="l" />
        </section>
        <section className="mb-2 flex items-start justify-between sm:gap-10">
          <div className="flex h-full flex-col justify-between">
            <p className="body-2 mb-2 w-full sm:mb-1 sm:line-clamp-2 lg:line-clamp-3 lg:min-h-[72px]">
              {storyData.title}
            </p>
            <span className=" *:caption-1 *:text-primary-500">
              <StoryMeta
                commentCount={storyData.commentCount || 0}
                publishDate={storyData.published_date}
                paywall={storyData.paywall || false}
                fullScreenAd={storyData.full_screen_ad || ''}
              />
            </span>
          </div>
          <div className="relative ml-3 aspect-[2/1] min-w-24 overflow-hidden rounded border-[0.5px] border-primary-200 sm:w-40 sm:min-w-40 md:hidden">
            <Image
              src={storyData.og_image || '/images/default-story-image.webP'}
              alt={`${storyData.title}'s story cover image`}
              fill
              className="object-cover"
            />
          </div>
        </section>
        <section className="mt-4 grid grid-cols-3">
          <div className="col-span-2">
            <StoryPickInfo
              displayPicks={storyData.pick}
              pickCount={storyData.pickCount || 0}
              maxCount={4}
            />
          </div>
          <div className="place-self-end">
            <StoryPickButton isStoryPicked={false} storyId={storyData.id} />
          </div>
        </section>
        {isCommentShow && (
          <Comment
            data={authorComment as CommentType}
            avatar={avatar}
            clampLineCount={3}
            canToggle={false}
          />
        )}
      </div>
    </>
  )
}

export default ArticleCard
