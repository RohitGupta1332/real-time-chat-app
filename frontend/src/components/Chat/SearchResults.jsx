import styles from '../../styles/sidebar.module.css';
import DefaultPic from '../../assets/default-profile.png';

const SearchResults = ({ results, setSearchValue, onUserClick, onAddUserToList }) => {
    if (!results || results.length === 0) {
        return <div className={styles.noResults}>No users found</div>;
    }

    return (
        <div className={styles.searchResults}>
            {results.map((user) => {
                const userItem = {
                    _id: user._id,
                    userId: user.userId,
                    name: user.name,
                    image: user.image,
                    bio: user.bio,
                    lastMessage: "",
                    time: "",
                    isActive: false
                };

                return (
                    <div
                        key={user._id}
                        className={styles.searchResultItem}
                        onClick={() => {
                            onAddUserToList(userItem);
                            onUserClick(userItem);
                            setSearchValue("");
                        }}
                    >
                        <img
                            src={user.image || DefaultPic}
                            alt={`${user.name}'s profile`}
                            className={styles.searchResultPic}
                        />
                        <div className={styles.searchResultInfo}>
                            <span className={styles.searchResultName}>{user.name}</span>
                            <span className={styles.searchResultUsername}>@{user.username}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default SearchResults;