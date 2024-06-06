/**
 * @jest-environment jsdom
 */

import { render, screen, waitFor } from '@testing-library/react';
import MenuPage from '../menu/page'; 
import { SessionProvider } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React from 'react';

// Mock the useRouter hook
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Provide a mock implementation for useRouter
(useRouter as jest.Mock).mockReturnValue({
  route: '/',
  pathname: '/',
  query: {},
  asPath: '',
  push: jest.fn(),
  prefetch: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
  back: jest.fn(),
  beforePopState: jest.fn(),
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
  isFallback: false,
});

// Mock the fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([
      // Mocked data for your menu items
      {
        id: '1',
        slug: 'juicy-burgers',
        title: 'Juicy Burgers',
        desc: 'Tasty and mouth-watering burgers with a variety of toppings.',
        img: '/images/burger.jpg', // Replace with the actual image path
        color: 'yellow'
      },
      // ... add more items as needed for your test
    ]),
  } as Response)
);

describe('MenuPage', () => {
  it('renders correctly without crashing', async () => {
    // Wrap the MenuPage component with SessionProvider
    render(
      <SessionProvider session={null}> 
        <MenuPage />
      </SessionProvider>
    );

    await waitFor(() => {
      // Check if the menu items are rendered
      const menuItem = screen.getByText('Juicy Burgers');
      expect(menuItem).toBeInTheDocument();

      // Check if the description is rendered
      const menuDescription = screen.getByText('Tasty and mouth-watering burgers with a variety of toppings.');
      expect(menuDescription).toBeInTheDocument();

      // Check if the 'Explore' button is rendered
      const exploreButton = screen.getByRole('button', { name: 'Explore' });
      expect(exploreButton).toBeInTheDocument();
    });
  });
});
