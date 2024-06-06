/**
 * @jest-environment jsdom
 */

import { render, screen, waitFor } from '@testing-library/react';
import SingleProductPage from '../product/[id]/page';
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
    json: () => Promise.resolve({
      // Mocked data for your single product
      id: '1',
      title: 'Juicy Burger',
      desc: 'A delicious burger with cheese, lettuce, tomato, and special sauce.',
      img: '/images/juicy-burger.jpg', // Replace with the actual image path
      price: '10.99',
      ingredients: ['Cheese', 'Lettuce', 'Tomato', 'Special Sauce'],
    }),
  } as Response)
);

describe('SingleProductPage', () => {
  it('SingleProductPage renders correctly', async () => {
    // Provide the params prop with a mock id
    const mockParams = { params: { id: '1' } };

    // Wrap the SingleProductPage component with SessionProvider and RouterContext.Provider
    render(
        <SessionProvider session={null}>
          <SingleProductPage {...mockParams} />
        </SessionProvider>
    );

    await waitFor(() => {
      // Check if the product title is rendered
      const productTitle = screen.getByText('Juicy Burger');
      expect(productTitle).toBeInTheDocument();

      // Check if the product description is rendered
      const productDescription = screen.getByText('A delicious burger with cheese, lettuce, tomato, and special sauce.');
      expect(productDescription).toBeInTheDocument();

      // Check if the product price is rendered
      const productPrice = screen.getByText('Base Price: 10.99');
      expect(productPrice).toBeInTheDocument();

      // Check if the ingredients list is rendered
      const ingredient = screen.getByText('Cheese');
      expect(ingredient).toBeInTheDocument();
    });
  });
});