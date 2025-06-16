"use client"
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'

function Library() {
  const { user } = useUser();
  const [fileUrls, setFileUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchFiles = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const response = await axios.get(`/api/getAllFiles/${user.id}`);
        console.log('Files fetched:', response.data);
        setFileUrls(response.data.fileUrls || []);
      } catch (error) {
        console.error('Error fetching files:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [user]);


  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg">Please sign in to access the library.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl text-white font-semibold leading-8 text-center mt-10 ">Library</h1>
      <div className="max-w-4xl mx-auto p-4 min-h-screen  h-full overflow-y-auto">
        {loading ? (
          <p className="text-center text-white">Loading...</p>
        ) : fileUrls.length > 0 ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fileUrls.map((url, index) => (
              <li key={index}>
                <Image
                  src={url}
                  alt={`File ${index + 1}`}
                  width={300}
                  height={150}
                  className="w-full h-auto object-cover rounded-lg shadow-md"
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center">No files found in your library.</p>
        )}
      </div>
    </div>
  );
}


export default Library