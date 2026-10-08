// client/src/pages/DashboardPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserLinks } from '../services/linkService';
import Spinner from '../components/Spinner';

const DashboardPage = () => {
  const [links, setLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedLinkId, setCopiedLinkId] = useState(null);

  const { token, logout } = useAuth();
  const navigate = useNavigate();

  // Fetch user's links
  const fetchLinks = useCallback(async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      const response = await getUserLinks(token);

      setLinks(response.data || []);

    } catch (err) {
      console.error('Failed to fetch links:', err);

      const errorMessage =
        err?.error ||
        err?.message ||
        'Could not load your links.';

      setError(errorMessage);

    } finally {
      setIsLoading(false);
    }
  }, [token]);

  // Fetch links when Dashboard opens
  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  // Logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Copy short URL
  const handleCopy = async (text, linkId) => {
    try {
      await navigator.clipboard.writeText(text);

      setCopiedLinkId(linkId);

      setTimeout(() => {
        setCopiedLinkId(null);
      }, 2000);

    } catch (err) {
      console.error('Failed to copy URL:', err);
      alert('Failed to copy URL.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto">

      {/* Dashboard Header */}
      <div className="flex justify-between items-center mb-6">

        <h2 className="text-3xl font-bold">
          My Dashboard
        </h2>

        <button
          onClick={handleLogout}
          className="bg-slate-200 hover:bg-slate-300 px-4 py-2 rounded-md font-semibold"
        >
          Logout
        </button>

      </div>

      {/* Main Content Container */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">

        {/* Loading State */}
        {isLoading ? (
          <div className="p-12 flex justify-center">
            <Spinner />
          </div>

        ) : error ? (

          <p className="p-6 text-red-500">
            Error: {error}
          </p>

        ) : links.length > 0 ? (

          <table className="w-full text-left">

            <thead className="bg-slate-50 border-b">
              <tr>

                <th className="p-4 font-semibold">
                  Original URL
                </th>

                <th className="p-4 font-semibold">
                  Short URL
                </th>

                <th className="p-4 font-semibold text-center">
                  Clicks
                </th>

                <th className="p-4 font-semibold">
                  Actions
                </th>

              </tr>
            </thead>

            <tbody>
              {links.map((link) => (
                <tr
                  key={link._id}
                  className="border-b last:border-0 hover:bg-slate-50"
                >

                  {/* Original URL */}
                  <td className="p-4 max-w-xs truncate">
                    <a
                      href={link.longUrl}
                      title={link.longUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {link.longUrl}
                    </a>
                  </td>

                  {/* Short URL */}
                  <td className="p-4">
                    <a
                      href={link.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 font-mono hover:underline"
                    >
                      {link.shortUrl}
                    </a>
                  </td>

                  {/* Clicks */}
                  <td className="p-4 text-center font-semibold">
                    {link.clicks}
                  </td>

                  {/* Actions */}
                  <td className="p-4">
                    <button
                      onClick={() =>
                        handleCopy(link.shortUrl, link._id)
                      }
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 text-sm rounded-md"
                    >
                      {copiedLinkId === link._id
                        ? 'Copied!'
                        : 'Copy'}
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>

        ) : (

          <p className="p-6 text-center text-slate-500">
            You haven't created any links yet.
          </p>

        )}

      </div>
    </div>
  );
};

export default DashboardPage;