import { useEffect, useMemo, useState } from "react";

import "./App.css";

const API_URL = "http://localhost:3000/api";

function App() {

  const [users, setUsers] = useState([]);

  const [meetings, setMeetings] = useState([]);

  const [currentUser, setCurrentUser] = useState(null);

  const [search, setSearch] = useState("");

  const [selectedUsers, setSelectedUsers] = useState([]);

  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");

  const [date, setDate] = useState("");

  const [time, setTime] = useState("");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [message, setMessage] = useState("");

  useEffect(() => {

    loadUsers();

  }, []);

  useEffect(() => {

    if (currentUser) {

      loadMeetings(currentUser._id);

    }

  }, [currentUser]);

  async function loadUsers() {

    try {

      setLoading(true);

      setError("");

      const response = await fetch(`${API_URL}/users`);

      if (!response.ok) {

        throw new Error("Failed to load users");

      }

      const data = await response.json();

      setUsers(data);

      const rafael =

        data.find((user) => user.email === "rafael@example.com") || data[0];

      setCurrentUser(rafael);

    } catch {

      setError("Could not load users.");

    } finally {

      setLoading(false);

    }

  }

  async function loadMeetings(userId) {

    try {

      setError("");

      const response = await fetch(

        `${API_URL}/meetings?userId=${userId}`

      );

      if (!response.ok) {

        throw new Error("Failed to load meetings");

      }

      const data = await response.json();

      setMeetings(data);

    } catch {

      setError("Could not load meetings.");

    }

  }

  function toggleUser(userId) {

    setSelectedUsers((current) =>

      current.includes(userId)

        ? current.filter((id) => id !== userId)

        : [...current, userId]

    );

  }

  async function createMeeting(event) {

    event.preventDefault();

    if (!title || !date || !time) {

      setError("Please fill in title, date and time.");

      return;

    }

    try {

      setError("");

      setMessage("");

      const startAt = new Date(`${date}T${time}`).toISOString();

      const response = await fetch(`${API_URL}/meetings`, {

        method: "POST",

        headers: {

          "Content-Type": "application/json",

        },

        body: JSON.stringify({

          title,

          description,

          startAt,

          organizer: currentUser._id,

          participantIds: selectedUsers,

        }),

      });

      if (!response.ok) {

        throw new Error("Failed to create meeting");

      }

      setTitle("");

      setDescription("");

      setDate("");

      setTime("");

      setSelectedUsers([]);

      setMessage("Meeting created successfully.");

      await loadMeetings(currentUser._id);

    } catch {

      setError("Could not create meeting.");

    }

  }

  async function respondToInvitation(meetingId, status) {

    try {

      setError("");

      setMessage("");

      const response = await fetch(

        `${API_URL}/meetings/${meetingId}/invitations/${currentUser._id}`,

        {

          method: "PATCH",

          headers: {

            "Content-Type": "application/json",

          },

          body: JSON.stringify({ status }),

        }

      );

      const data = await response.json();

      if (!response.ok) {

        setError(data.message || "Could not update invitation.");

        return;

      }

      setMessage(

        status === "accepted"

          ? "Invitation accepted."

          : "Invitation declined."

      );

      await loadMeetings(currentUser._id);

    } catch {

      setError("Could not update invitation.");

    }

  }

  const filteredUsers = useMemo(() => {

    const normalizedSearch = search.toLowerCase();

    return users.filter(

      (user) =>

        user._id !== currentUser?._id &&

        (user.name.toLowerCase().includes(normalizedSearch) ||

          user.email.toLowerCase().includes(normalizedSearch))

    );

  }, [users, search, currentUser]);

  if (loading) {

    return (

      <main className="state-page">

        <p>Loading application...</p>

      </main>

    );

  }

  return (

    <div className="app">

      <header className="header">

        <div>

          <span className="eyebrow">Buildtoo Challenge</span>

          <h1>Meetings</h1>

        </div>

        {currentUser && (

      <div className="current-user">

        <div className="avatar">

          {currentUser.name.charAt(0)}

        </div>

        <div>

          <strong>Viewing as</strong>

          <select

            value={currentUser._id}

            onChange={(event) => {

              const user = users.find(

                (item) => item._id === event.target.value

              );

              setCurrentUser(user);

              setMessage("");

              setError("");

            }}

          >

            {users.map((user) => (

              <option key={user._id} value={user._id}>

                {user.name}

              </option>

            ))}

          </select>

        </div>

      </div>

    )}

      </header>

      {error && (

        <div className="alert error">

          {error}

          <button onClick={() => setError("")}>×</button>

        </div>

      )}

      {message && (

        <div className="alert success">

          {message}

          <button onClick={() => setMessage("")}>×</button>

        </div>

      )}

      <div className="layout">

        <section>

          <div className="section-heading">

            <div>

              <span className="eyebrow">Schedule</span>

              <h2>Your meetings</h2>

            </div>

            <span className="meeting-count">

              {meetings.length}

            </span>

          </div>

          <div className="meeting-list">

            {meetings.length === 0 ? (

              <div className="empty-state">

                <h3>No meetings yet</h3>

                <p>Create your first meeting using the form.</p>

              </div>

            ) : (

              meetings.map((meeting) => {

                const invitation = meeting.participants.find(

                  (participant) =>

                    participant.user._id === currentUser._id

                );

                const isOrganizer =

                  meeting.organizer._id === currentUser._id;

                return (

                  <article className="meeting-card" key={meeting._id}>

                    <div className="meeting-top">

                      <div>

                        <h3>{meeting.title}</h3>

                        <p>{meeting.description || "No description"}</p>

                      </div>

                      {isOrganizer ? (

                        <span className="badge organizer">

                          Organizer

                        </span>

                      ) : (

                        <span

                          className={`badge ${

                            invitation?.status || "pending"

                          }`}

                        >

                          {invitation?.status || "pending"}

                        </span>

                      )}

                    </div>

                    <div className="meeting-date">

                      {new Date(meeting.startAt).toLocaleDateString(

                        undefined,

                        {

                          weekday: "short",

                          day: "numeric",

                          month: "short",

                        }

                      )}

                      {" · "}

                      {new Date(meeting.startAt).toLocaleTimeString(

                        [],

                        {

                          hour: "2-digit",

                          minute: "2-digit",

                        }

                      )}

                    </div>

                    <div className="participants">

                      <strong>Participants</strong>

                      {meeting.participants.length === 0 ? (

                        <span>No participants</span>

                      ) : (

                        meeting.participants.map((participant) => (

                          <div

                            className="participant"

                            key={participant.user._id}

                          >

                            <span>{participant.user.name}</span>

                            <span

                              className={`status ${participant.status}`}

                            >

                              {participant.status}

                            </span>

                          </div>

                        ))

                      )}

                    </div>

                    {!isOrganizer &&

                      invitation?.status === "pending" && (

                        <div className="actions">

                          <button

                            className="secondary"

                            onClick={() =>

                              respondToInvitation(

                                meeting._id,

                                "declined"

                              )

                            }

                          >

                            Decline

                          </button>

                          <button

                            className="primary"

                            onClick={() =>

                              respondToInvitation(

                                meeting._id,

                                "accepted"

                              )

                            }

                          >

                            Accept

                          </button>

                        </div>

                      )}

                  </article>

                );

              })

            )}

          </div>

        </section>

        <aside className="create-panel">

          <span className="eyebrow">New meeting</span>

          <h2>Create a meeting</h2>

          <form onSubmit={createMeeting}>

            <label>

              Title

              <input

                value={title}

                onChange={(event) => setTitle(event.target.value)}

                placeholder="Weekly sync"

              />

            </label>

            <label>

              Description

              <textarea

                value={description}

                onChange={(event) =>

                  setDescription(event.target.value)

                }

                placeholder="What is this meeting about?"

                rows="3"

              />

            </label>

            <div className="date-row">

              <label>

                Date

                <input

                  type="date"

                  value={date}

                  onChange={(event) => setDate(event.target.value)}

                />

              </label>

              <label>

                Time

                <input

                  type="time"

                  value={time}

                  onChange={(event) => setTime(event.target.value)}

                />

              </label>

            </div>

            <div className="invite-section">

              <label>

                Invite people

                <input

                  value={search}

                  onChange={(event) => setSearch(event.target.value)}

                  placeholder="Search by name or email"

                />

              </label>

              <div className="user-list">

                {filteredUsers.length === 0 ? (

                  <p className="no-results">No users found.</p>

                ) : (

                  filteredUsers.map((user) => (

                    <label className="user-option" key={user._id}>

                      <div>

                        <strong>{user.name}</strong>

                        <span>{user.email}</span>

                      </div>

                      <input

                        type="checkbox"

                        checked={selectedUsers.includes(user._id)}

                        onChange={() => toggleUser(user._id)}

                      />

                    </label>

                  ))

                )}

              </div>

            </div>

            <button className="primary create-button" type="submit">

              Create meeting

            </button>

          </form>

        </aside>

      </div>

    </div>

  );

}

export default App;