import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  const [isShow, setIsShow] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleOnClick() {
    setIsShow((prevState) => !prevState);
  }

  function handleOnAddFriends(friend) {
    setSelectedFriend(null);
    setFriends((prevFriends) => [...prevFriends, friend]);
    setIsShow(false);
  }

  function handleSelection(friend) {
    setSelectedFriend((prevState) =>
      prevState?.id === friend.id ? null : friend
    );
    setIsShow(false);
  }

  function handleSplitBill(value) {
    console.log(value);
    setFriends((prevFriends) =>
      prevFriends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <Friends
          friends={friends}
          selectedFriend={selectedFriend}
          handleSelection={handleSelection}
        />

        {isShow && <AddFriend onAddFriend={handleOnAddFriends} />}

        <Button onClick={handleOnClick}>
          {isShow ? "Close" : "Add Friend"}
        </Button>
      </div>

      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          handleSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function Friends(props) {
  const { friends, selectedFriend, handleSelection } = props;
  return (
    <ul className="sidebar">
      {friends.map((friend) => (
        <li
          key={friend.id}
          className={friend.id === selectedFriend?.id ? "selected" : ""}
        >
          <img src={friend.image} alt={friend.id} />
          <h3>{friend.name}</h3>
          {friend.balance < 0 && (
            <p className="red">
              You owe {friend.name} {Math.abs(friend.balance)}$
            </p>
          )}
          {friend.balance > 0 && (
            <p className="green">
              {friend.name} owes you {friend.balance}$
            </p>
          )}
          {friend.balance === 0 && <p>You are even with {friend.name}</p>}
          <Button onClick={() => handleSelection(friend)}>
            {friend.id === selectedFriend?.id ? "Close" : "Select"}
          </Button>
        </li>
      ))}
    </ul>
  );
}

function AddFriend(props) {
  const { onAddFriend } = props;
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleOnAddFriend(event) {
    event.preventDefault();
    const id = crypto.randomUUID();
    if (!name || !image) return;
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };

    onAddFriend(newFriend);

    setName("");
    setImage("https://i.pravatar.cc/48");
  }
  return (
    <form className="form-add-friend" onSubmit={handleOnAddFriend}>
      <label>👭Friend's name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>🌆Image Url</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill(props) {
  const { selectedFriend, handleSplitBill } = props;
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const paidByFriend = bill ? bill - paidByUser : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  function handleOnSplitBill(event) {
    event.preventDefault();
    if (!bill || paidByUser === "") return;
    handleSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
  }

  return (
    <form className="form-split-bill" onSubmit={handleOnSplitBill}>
      <h2>Split the bill {selectedFriend.name}</h2>

      <label>💸Bill Value</label>
      <input
        type="text"
        value={bill}
        onChange={(event) => setBill(Number(event.target.value))}
      />

      <label>🧍‍♂️Your expense</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(event) =>
          setPaidByUser(
            Number(event.target.value) > bill
              ? paidByUser
              : Number(event.target.value)
          )
        }
      />

      <label>👩🏻‍🤝‍👩🏻{selectedFriend.name}'s expense</label>
      <input type="text" disabled value={paidByFriend} />

      <label>🤑Who's paying the bill</label>
      <select
        value={whoIsPaying}
        onChange={(event) => setWhoIsPaying(event.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button>Split Bill</Button>
    </form>
  );
}
