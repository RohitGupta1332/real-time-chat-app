import styles from '../../styles/sidebar.module.css';

const SearchResults = ({ results, setUserList, setSearchValue, onUserClick }) => {
    if (!results || results.length === 0) {
        return <div className={styles.noResults}>No users found</div>;
    }

    return (
        <div className={styles.searchResults}>
            {results.map((user) => (
                <div
                    key={user._id}
                    className={styles.searchResultItem}
                    onClick={() => {
                        const userItem = {
                            user: { _id: user.userId, fullName: user.name, profilePic: user.image },
                            lastMessage: "Nevermind!",
                            time: "8:40 AM",
                            isActive: false,
                        };
                        setUserList((prevList) => [userItem, ...prevList]);
                        setSearchValue("");
                        onUserClick({ _id: user.userId, fullName: user.name, profilePic: user.image });
                    }}
                >
                    <img
                        src={user.image}
                        alt={`${user.name}'s profile`}
                        className={styles.searchResultPic}
                    />
                    <div className={styles.searchResultInfo}>
                        <span className={styles.searchResultName}>{user.name}</span>
                        <span className={styles.searchResultUsername}>@{user.username}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SearchResults;