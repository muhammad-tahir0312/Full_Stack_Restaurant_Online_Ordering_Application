/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react';
import CartPage from '../cart/page';
import { useSession } from 'next-auth/react';

// Mock the useRouter hook using 'next/navigation'
jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));

// Mock the useSession hook
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

// Mock the useCartStore hook with persist and rehydrate
jest.mock('../../utils/store', () => ({
  useCartStore: jest.fn(() => ({
    products: [
      { id: '1', title: 'Product 1', quantity: 2, price: '20.00', img: '/images/product1.jpg' },
      { id: '2', title: 'Product 2', quantity: 1, price: '22.97', img: '/images/product2.jpg' },
      // Add more products as needed for testing
    ],
    totalItems: 5,
    totalPrice: 42.97,
    removeFromCart: jest.fn(),
    // Mock the persist object with a no-op rehydrate function
    persist: {
      rehydrate: jest.fn(), // This should be a no-op function
    },
  })),
}));

describe('CartPage', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('renders cart items and checkout button', async () => {
    // Arrange: Set up the necessary session data for the test
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          email: 'test@example.com',
        },
      },
    });

    // Act: Render the CartPage component
    render(<CartPage />);

    // Assert: Check if products are rendered
    const product1Text = (content: string, node: Element | null) => {
    const hasText = (node: Element) => node.textContent === 'Product 1 x2';
    const nodeHasText = node ? hasText(node) : false;
    const childrenDontHaveText = node ? Array.from(node.children).every(
      (child) => !hasText(child)
    ) : false;
    return nodeHasText && childrenDontHaveText;
  };
  expect(await screen.findByText(product1Text)).toBeInTheDocument();
  expect(await screen.findByText('Product 2 x1')).toBeInTheDocument();
  
    // Assert: Check if prices are rendered
    expect(await screen.findByText('Subtotal (5 items)')).toBeInTheDocument();
    expect(await screen.findByText('$42.97')).toBeInTheDocument();
    expect(await screen.findByText('TOTAL(INCL. VAT)')).toBeInTheDocument();

    // Assert: Check if checkout button is rendered
    expect(await screen.findByRole('button', { name: /checkout/i })).toBeInTheDocument();
  });
});