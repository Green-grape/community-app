export interface User {
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  createdAt: string;
  updatedAt: string;
  identifier: string;
  title: string;
  slug: string;
  body: string;
  subName: string;
  username: string;
  sub?: Sub;

  //expose
  url: string;
  userVote?: number;
  voteScore?: number;
  commentcount?: number;
}

export interface Sub {
  createdAt: string;
  updatedAt: string;
  name: string;
  title: string;
  description: string;
  imageUrn: string;
  bannerUrn: string;
  username: string;
  posts: Post[];

  //expose
  imageUrl: string;
  bannerUrl: string;
}

export interface Comment {
  identifier: string;
  body: string;
  username: string;
  createdAt: string;
  updatedAt: string;
  post: Post;

  userVote: string;
  voteScore: string;
}
