import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import { FaLockOpen } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import axios from "axios";

const Users = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, []);

  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const baseURL =
    "http://task4-env.eba-sp5dwj22.us-east-1.elasticbeanstalk.com/users";

  const [isUsersLoaded, setIsUsersLoaded] = useState(false);

  const onLogoutClick = () => {
    localStorage.clear();
  };

  if (isUsersLoaded === false) {
    axios
      .get(baseURL)
      .then((res) => {
        setUsers([...res.data]);
        setIsUsersLoaded(true);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const selectUser = (user) => {
    const idx = selectedUsers.indexOf(user);
    if (idx === -1) {
      setSelectedUsers([...selectedUsers, user]);
    } else {
      selectedUsers.splice(idx, 1);
      setSelectedUsers([...selectedUsers]);
    }
  };

  const selectAllUsers = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users);
    }
  };

  const onDeleteClick = () => {
    const userIds = selectedUsers.map((el) => el.id);
    axios
      .post(baseURL + "/batch-delete", userIds)
      .then((res) => {
        if (res.status === 204) {
          axios
            .get(baseURL)
            .then((res) => {
              setUsers([...res.data]);
              setSelectedUsers([]);
              setIsUsersLoaded(true);
            })
            .catch((error) => {
              console.log(error);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onBlockUsers = () => {
    const userIds = selectedUsers.map((el) => el.id);
    axios
      .put(baseURL + "/block/batch", userIds)
      .then((res) => {
        if (res.status === 200) {
          axios
            .get(baseURL)
            .then((res) => {
              const selectedUsersCopy = [...selectedUsers];
              setUsers([...res.data]);
              setSelectedUsers([]);
              setIsUsersLoaded(true);
              if (selectedUsersCopy.length === users.length) {
                localStorage.clear();
                navigate("/login");
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onUnblockUsers = () => {
    const userIds = selectedUsers.map((el) => el.id);
    axios
      .put(baseURL + "/unblock/batch", userIds)
      .then((res) => {
        if (res.status === 200) {
          axios
            .get(baseURL)
            .then((res) => {
              setUsers([...res.data]);
              setSelectedUsers([]);
              setIsUsersLoaded(true);
            })
            .catch((error) => {
              console.log(error);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="users__container">
      <div className="welcome__section">
        <h3>
          Hello, {localStorage.getItem("user")}!
          <span>
            <Link to="/login" className="logout_link" onClick={onLogoutClick}>
              Logout
            </Link>
          </span>
        </h3>
      </div>

      <div className="list">
        <div className="btns">
          <button onClick={onBlockUsers} className="block__btn">
            Block <FaLock />
          </button>
          <button onClick={onUnblockUsers}>
            Unblock <FaLockOpen />
          </button>
          <button onClick={onDeleteClick}>
            Delete <MdDelete />
          </button>
        </div>
        <table id="users">
          <thead>
            <tr>
              <th>
                {" "}
                <input
                  type="checkbox"
                  checked={selectedUsers.length === users.length}
                  onChange={selectAllUsers}
                />{" "}
              </th>
              <th>Name</th>
              <th>e-Mail</th>
              <th>Last login</th>
              <th>Registration time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              return (
                <tr key={user.id}>
                  <td>
                    {selectedUsers.indexOf(user) !== -1 ? (
                      <input
                        type="checkbox"
                        checked
                        onChange={() => selectUser(user)}
                      />
                    ) : (
                      <input
                        type="checkbox"
                        onChange={() => selectUser(user)}
                      />
                    )}
                  </td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.last_login_time}</td>
                  <td>{user.registration_time}</td>
                  <td>{user.status}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
