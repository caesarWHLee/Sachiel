'use client'
import { useEffect, useState } from 'react'

import ArticleCard from '@/app/profile/_components/article-card'
import ArticleCardList from '@/app/profile/_components/article-card-list'
import ProfileButtonList from '@/app/profile/_components/profile-button-list'
import Tab from '@/app/profile/_components/tab'
import UserProfile from '@/app/profile/_components/user-profile'
import UserStatusList from '@/app/profile/_components/user-status-list'
import { type GetMemberProfileQuery } from '@/graphql/__generated__/graphql'
import { TabCategory, TabKey } from '@/types/tab'

export type userType = 'member' | 'visitor'

type Picks = NonNullable<GetMemberProfileQuery['member']>['picks']
type Bookmarks = NonNullable<GetMemberProfileQuery['member']>['books']

type MemberPageProps = {
  name: string
  avatar: string
  intro: string
  pickCount: number
  followingCount: string
  followerCount: string
  userType: userType
  picksData: Picks
  bookmarks: Bookmarks
  memberId: string
}

const MemberPage: React.FC<MemberPageProps> = ({
  userType,
  name,
  avatar,
  intro,
  pickCount,
  followingCount,
  followerCount,
  picksData,
  bookmarks,
  memberId,
}) => {
  const [picksOrBookmarks, setPicksOrBookmarks] = useState<Picks | Bookmarks>(
    picksData
  )
  const [category, setCategory] = useState<TabCategory>(TabCategory.PICK)

  const userStatusList = [
    { tabName: TabKey.PICK, count: pickCount },
    { tabName: TabKey.FOLLOWER, count: followerCount },
    { tabName: TabKey.FOLLOWING, count: followingCount },
  ]

  const buttonList = [{ text: '編輯個人檔案' }]

  const getMessage = (category: TabCategory): string => {
    const messages: { [key: string]: string } = {
      PICKS: '這裡還空空的\n趕緊將喜愛的新聞加入精選吧',
      BOOKMARKS: '沒有已儲存的書籤',
    }
    return messages[category] || ''
  }
  useEffect(() => {
    switch (category) {
      case TabCategory.PICK:
        return setPicksOrBookmarks(picksData)
      case TabCategory.BOOKMARKS:
        return setPicksOrBookmarks(bookmarks)
      default:
        return setPicksOrBookmarks(picksData)
    }
  }, [bookmarks, category, picksData])

  return (
    <>
      <div className="flex max-h-[calc(100%_-_152px)] flex-col items-center bg-white px-5 pb-8 pt-6 sm:max-h-full">
        <UserProfile
          name={name}
          pickCount={pickCount}
          avatar={avatar}
          userType={userType}
          intro={intro}
        />
        <ProfileButtonList buttonList={buttonList} />
        <UserStatusList userStatusList={userStatusList} />
      </div>

      <Tab
        tabCategory={category}
        setCategory={setCategory}
        userType={userType}
      />
      <ArticleCardList
        items={picksOrBookmarks || []}
        renderItem={(pick, index, isLast) =>
          pick.story ? (
            <ArticleCard
              storyData={pick.story}
              isLast={isLast}
              memberId={memberId}
              avatar={avatar}
              category={category}
              name={name}
              userType={userType}
            />
          ) : (
            <></>
          )
        }
        userType={userType}
        category={category}
        emptyMessage={getMessage(category)}
      />
    </>
  )
}

export default MemberPage
