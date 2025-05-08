export const getUserWithMobilePhoneOrEmail = async (requestF) => {
  const response = await fetch("http://localhost:3000/users");
  const users = await response.json();
  return users.find(
    (user) => user.phone === requestF || user.email === requestF
  );
};

export const addUser = async (newUser) => {
  const response = await fetch("http://localhost:3000/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newUser),
  });

  if (!response.ok) {
    throw new Error("Không thể thêm người dùng mới");
  }

  const createdUser = await response.json();
  return createdUser;
};

export const updateUser = async (id, updatedFields) => {
  const response = await fetch(`http://localhost:3000/users/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedFields),
  });

  if (!response.ok) {
    throw new Error("Không thể cập nhật người dùng");
  }

  const updatedUser = await response.json();
  return updatedUser;
};
