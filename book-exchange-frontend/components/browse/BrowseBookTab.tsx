"use client";

import BrowseBookList from "../browse/BrowseBookList";

interface Props {
  userId: string;
}

export default function BrowseTab({ userId }: Props) {
  return (
    <div className="space-y-6">

      <h2 className="text-xl font-semibold">
        Browse Books
        
      </h2>

      <BrowseBookList currentUserId={userId} />

    </div>
  );
}
