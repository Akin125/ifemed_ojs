'use server';

/**
 * Server Actions for User Registration and Dashboard
 * 
 * These actions handle form submissions and API interactions
 * securely on the server side.
 */

import { registerUser, getUserSubmissions } from '@/lib/ojs';
import { revalidatePath } from 'next/cache';

/**
 * Register a new user as an author
 * 
 * @param formData - Form data from registration form
 * @returns Result object with success status and message
 */
export async function registerUserAction(formData: FormData) {
  try {
    const username = formData.get('username') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const givenName = formData.get('givenName') as string;
    const familyName = formData.get('familyName') as string;
    const affiliation = formData.get('affiliation') as string;
    const country = formData.get('country') as string;

    // Validate required fields
    if (!username || !email || !password || !givenName || !familyName) {
      return {
        success: false,
        message: 'Please fill in all required fields.',
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        message: 'Please enter a valid email address.',
      };
    }

    // Validate password strength
    if (password.length < 6) {
      return {
        success: false,
        message: 'Password must be at least 6 characters long.',
      };
    }

    // Register user with userGroupId: 18 (Author)
    const userData = {
      username,
      email,
      password,
      givenName,
      familyName,
      affiliation: affiliation || undefined,
      country: country || undefined,
      userGroupId: 18, // Author role in OJS
    };

    await registerUser(userData);

    return {
      success: true,
      message: 'Registration successful! You can now log in.',
    };
  } catch (error: any) {
    console.error('Registration error:', error);
    
    // Handle specific error cases
    if (error.message?.includes('409')) {
      return {
        success: false,
        message: 'Username or email already exists.',
      };
    }

    return {
      success: false,
      message: 'Registration failed. Please try again later.',
    };
  }
}

/**
 * Fetch user submissions for dashboard
 * 
 * @param userId - User ID
 * @returns Array of user submissions
 */
export async function getUserSubmissionsAction(userId: number) {
  try {
    const submissions = await getUserSubmissions(userId);
    return {
      success: true,
      submissions,
    };
  } catch (error) {
    console.error('Error fetching user submissions:', error);
    return {
      success: false,
      submissions: [],
      message: 'Failed to load submissions.',
    };
  }
}
