'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// READ actions
export async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      include: {
        posts: true,
        _count: {
          select: { comments: true, posts: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      cacheStrategy: {
        ttl: 60, // Cache is fresh for 60 seconds
        tags: ["users_list"], // Tag for cache invalidation
      }

    });
    
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users');
  }
}

export async function getPosts(limit = 5) {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: true,
        comments: {
          include: {
            author: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        _count: {
          select: { comments: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      cacheStrategy: {
        swr: 120, // Serve stale data for up to 120 seconds while revalidating
        tags: ["posts_list"], // Tag for cache invalidation
      }
    });
    
    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw new Error('Failed to fetch posts');
  }
}

export async function getUserById(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        posts: {
          orderBy: {
            createdAt: 'desc'
          }
        },
        comments: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        },
        _count: {
          select: { comments: true, posts: true }
        },
      },
      cacheStrategy: {
        ttl: 30,    // Fresh for 30 seconds
        swr: 60,    // Then stale but acceptable for 60 more seconds
        tags: [`user_${id}`], // User-specific tag
      }
    });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error);
    throw error;
  }
}

// CREATE actions
export async function createUser({ email, name }: { email: string; name?: string }) {
  if (!email) {
    throw new Error('Email is required');
  }
  
  try {
    const user = await prisma.user.create({
      data: {
        email,
        name,
      },
    });
    
    // Revalidate the home page to show the new user
    revalidatePath('/');
    
    return user;
  } catch (error: any) {
    // Handle duplicate email error
    if (error.code === 'P2002') {
      throw new Error('A user with this email already exists');
    }
    
    throw new Error('Failed to create user');
  }
}

// Post actions
export async function createPost({ 
  title, 
  content, 
  authorId, 
  published = false 
}: { 
  title: string; 
  content?: string; 
  authorId: string; 
  published?: boolean 
}) {
  if (!title || !authorId) {
    throw new Error('Title and author are required');
  }
  
  try {
    // Ensure the author exists
    const authorExists = await prisma.user.findUnique({
      where: { id: authorId }
    });
    
    if (!authorExists) {
      throw new Error('Author not found');
    }
    
    const post = await prisma.post.create({
      data: {
        title,
        content,
        published,
        author: {
          connect: { id: authorId }
        }
      },
      include: {
        author: true
      }
    });
    
    // Revalidate the home page to show the new post
    revalidatePath('/');
    
    return post;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
}

// Comment actions
export async function createComment({ 
  content, 
  postId, 
  authorId 
}: { 
  content: string; 
  postId: string; 
  authorId: string 
}) {
  if (!content || !postId || !authorId) {
    throw new Error('Content, post, and author are required');
  }
  
  try {
    // Ensure both the post and author exist
    const postExists = await prisma.post.findUnique({
      where: { id: postId }
    });
    
    const authorExists = await prisma.user.findUnique({
      where: { id: authorId }
    });
    
    if (!postExists) {
      throw new Error('Post not found');
    }
    
    if (!authorExists) {
      throw new Error('Author not found');
    }
    
    const comment = await prisma.comment.create({
      data: {
        content,
        post: {
          connect: { id: postId }
        },
        author: {
          connect: { id: authorId }
        }
      },
      include: {
        author: true,
        post: true
      }
    });
    
    // Revalidate the home page to show the new comment
    revalidatePath('/');

    return comment;
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }

   
}