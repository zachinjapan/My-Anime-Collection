import { Loading, FormRow } from "../../Components/Atoms";

import { useEffect, useState } from "react";
import { useAppContext } from "../../context/appContext";
import styled from "styled-components";
import { AiFillDelete } from "react-icons/ai";

import { useTranslation } from "react-i18next";
const Profile = () => {
  const { t } = useTranslation();
  const {
    showAlert,
    getPlaylists,
    updatePlaylist,
    deletePlaylist,
    createPlaylist,
    isLoading,
    userPlaylists,
    currentPlaylist,
    handlePlaylistChange,
  } = useAppContext();

  const [newTitle, setNewTitle] = useState("");
  const [id, setId] = useState("");

  const handleClickOnPlaylist = async (id) => {
    if (isLoading) return;
    // find the playlist with the title
    const playlist = userPlaylists.find((playlist) => playlist.id === id);
    // update the current playlist

    if (!playlist) {
      return;
    }
    await handlePlaylistChange({ name: playlist.id, value: playlist.id });
    setNewTitle(playlist.title);
    setId(playlist.id);
  };

  useEffect(() => {
    getPlaylists();
    setNewTitle(currentPlaylist.title);
    setId(currentPlaylist.id);
  }, []);

  const handleNewPlaylistSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    const numberOfPlaylists = userPlaylists.length - 1;

    await createPlaylist(`New Playlist #`);

    setNewTitle(userPlaylists[numberOfPlaylists].title);
    setId(userPlaylists[numberOfPlaylists].id);
  };
  // set the most recent playlist as the current playlist

  const handlePlaylistEdit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    await updatePlaylist({
      title: newTitle,
      id: id,
    });
    await getPlaylists();
  };

  if (isLoading) {
    return <Loading center />;
  }

  return (
    <Wrapper>
      <div className="profile-container">
        <h3>{t("edit_playlist.title")}</h3>
        <div className="form-left">
          <ul>
            {userPlaylists.map((playlist) => (
              <li
                key={playlist.id}
                className={playlist.id === currentPlaylist.id ? "active" : ""}
              >
                <span
                  onClick={() => handleClickOnPlaylist(playlist.id)}
                  className="playlist-title"
                >
                  {playlist.title}
                </span>
                {playlist.id !== "0" && (
                  <span
                    style={{
                      padding: "0px 10px",
                    }}
                    onClick={async () => {
                      if (
                        window.confirm(
                          "Are you sure you want to delete this playlist?"
                        )
                      ) {
                        await deletePlaylist(playlist.id);
                        setNewTitle("");
                        setId("");
                      }
                    }}
                  >
                    <AiFillDelete
                      style={{
                        display: "-ms-flexbox",
                        justifyContent: "center",
                        alignItems: "center",
                        color: "red",
                        fontSize: "1.5rem",
                        marginLeft: "1rem",
                        backgroundColor: "transparent",
                      }}
                    />
                  </span>
                )}
              </li>
            ))}
          </ul>

          <button className="btn" onClick={handleNewPlaylistSubmit}>
            {t("edit_playlist.new_playlist")}
          </button>
        </div>
      </div>

      <hr
        style={{
          border: "1px solid #ccc",
          margin: "1rem 0",
        }}
      ></hr>
      {currentPlaylist.id !== "0" && (
        <form className="form" onSubmit={handlePlaylistEdit}>
          <div className="form-center">
            <FormRow
              type="text"
              name="title"
              value={newTitle}
              labelText={t("edit_playlist.cta")}
              handleChange={(e) => setNewTitle(e.target.value)}
            />
            <button
              className="btn btn-block"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? t("profile.wait") : t("profile.save")}
            </button>
          </div>
        </form>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.section`
  border-radius: var(--borderRadius);
  width: 100%;
  background: var(--white);
  padding: 3rem 2rem 4rem;
  box-shadow: var(--shadow-2);
  .active {
    font-weight: bold;
    border-radius: 5px;
    padding: 5px;
    margin-bottom: 5px;
    border: 5px solid #ccc;
    cursor: pointer;
  }

  .playlist-title {
    font-size: 1.1rem;
  }

  .form {
    margin: 0;
    border-radius: 0;
    box-shadow: none;
    padding: 0;
    max-width: 100%;
    width: 100%;
  }
  .form-row {
    margin-bottom: 0;
  }
  .form-center {
    display: grid;
    row-gap: 0.5rem;
  }
  .form-center button {
    align-self: end;
    height: 35px;
    margin-top: 1rem;
  }

  @media (min-width: 992px) {
    .form-center {
      grid-template-columns: 1fr 1fr;
      align-items: center;
      column-gap: 1rem;
    }
  }
  @media (min-width: 1120px) {
    .form-center {
      grid-template-columns: 1fr 1fr 1fr;
    }
    .form-center button {
      margin-top: 0;
    }
  }
`;

export default Profile;
