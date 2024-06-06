/**
 * @jest-environment jsdom
 */

import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { signIn} from 'next-auth/react';
import LoginPage from '../login/page';
import React from 'react';

jest.mock('next-auth/react', () => ({
  useSession: () => [{ status: 'authenticated' }, false],
  signIn: jest.fn(),
}));
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    prefetch: () => null,
  }),
}));

describe('LoginPage', () => {
  it('renders without crashing', () => {
    const { getByText } = render(<LoginPage />);
    expect(getByText('Welcome')).toBeInTheDocument();
  });

  it('calls signIn when the sign in button is clicked', async () => {
    const { getByText } = render(<LoginPage />);
    fireEvent.click(getByText('Sign in with Google'));
    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('google');
    });
  });
});