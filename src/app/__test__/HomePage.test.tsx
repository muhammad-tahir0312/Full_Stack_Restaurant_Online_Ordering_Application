/**
 * @jest-environment jsdom
 */

import { render, screen, waitFor } from '@testing-library/react';
import Home from '../page';
import { useRouter } from 'next/navigation'; 
import React from 'react';

// Mock the useRouter hook
jest.mock('next/navigation');

describe('Home', () => {
  it('renders Home Page', async () => {
    // Mock the useRouter implementation
    (useRouter as jest.Mock).mockReturnValue({
      route: '/',
      pathname: '/',
      query: '',
      asPath: '',
      push: jest.fn(), 
    });

    render(<Home />);

    await waitFor(() => {
      const mainHeading = screen.getByText("Delicious Burger & French Fry");
      expect(mainHeading).toBeInTheDocument();
    });
  });

  it('displays slides after 3 seconds', async () => {
    // Mock the useRouter implementation
    (useRouter as jest.Mock).mockReturnValue({
      route: '/',
      pathname: '/',
      query: '',
      asPath: '',
      push: jest.fn(), 
    });

    render(<Home />);

    await waitFor(() => {
      const deliveryMessage = screen.getByText("Order Now");
      expect(deliveryMessage).toBeInTheDocument();
    });
  });
});