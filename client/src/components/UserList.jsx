import React from 'react';

const UserList = ({ users }) => (
  <div className="w-64 bg-white border-r">
    <div className="p-4">
      <h2 className="text-lg font-semibold">Online Users</h2>
      <ul className="mt-2">
        {users.map((user, index) => (
          <li key={index} className="py-2 px-2 hover:bg-gray-100 rounded">
            {user}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default UserList;