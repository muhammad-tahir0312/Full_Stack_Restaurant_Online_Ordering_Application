/**
 * @jest-environment jsdom
 */

import { render, screen, waitFor } from '@testing-library/react';
import ProfilePage from '../profile/page';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Session } from 'next-auth';

// Mock the useRouter hook
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the useSession hook
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

describe('ProfilePage', () => {
  const mockUseSession = (session: Session | null) => {
    (useSession as jest.Mock).mockReturnValue({
      data: session,
      status: session ? 'authenticated' : 'loading',
    });
  };

  const mockUseRouter = () => {
    const router = {
      push: jest.fn(),
    };

    (useRouter as jest.Mock).mockReturnValue(router);
  };

  beforeEach(() => {
    mockUseRouter();
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(),
      })
    );
  });

  test('renders Loading message when session is loading', () => {
    mockUseSession(null);

    render(<ProfilePage />);

    const loadingElement = screen.getByText('Loading...');
    expect(loadingElement).toBeInTheDocument();
  });

  test('renders User not authenticated or profile not found message when session is unauthenticated', () => {
    const session: Session = {
      user: {
        id: '123',
        email: 'test@example.com',
        isAdmin: true,
      },
      expires: '1234567890',
    };
    mockUseSession(session);

    render(<ProfilePage />);

    const messageElement = screen.getByText('User not authenticated or profile not found');
    expect(messageElement).toBeInTheDocument();
  });

  test('renders profile data when session is authenticated', async () => {
    const session: Session = {
      user: {
        id: '123',
        email: 'test@example.com',
        isAdmin: true,
      },
      expires: '1234567890',
    };

    mockUseSession(session);

    const mockProfile = {
      id: '123',
      email: 'test@example.com',
      name: 'Test User',
      image: 'http://example.com/image.jpg',
      Order: [
        {
          id: '1',
          product: {
            id: '1',
            title: 'Product 1',
            desc: 'Description 1',
            price: 10,
            catSlug: 'category-1',
            image: 'http://example.com/image1.jpg',
          },
          quantity: 2,
          status: 'completed',
          createdAt: '2023-03-01T12:00:00Z',
        },
      ],
    };

    global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockProfile),
    } as Response)
  );

    render(<ProfilePage />);

    await waitFor(() => {
      const idElement = screen.getByDisplayValue("123");
      expect(idElement).toBeInTheDocument();

      const emailElement = screen.getByDisplayValue('test@example.com');
      expect(emailElement).toBeInTheDocument();

      const nameElement = screen.getByDisplayValue('Test User');
      expect(nameElement).toBeInTheDocument();
    });
  });
});
