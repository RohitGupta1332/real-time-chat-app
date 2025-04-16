import styles from '../../styles/sidebar.module.css';

const SearchResults = ({ results, setUserList, setSearchValue }) => {
    if (!results || results.length === 0) {
        return <div className={styles.noResults}>No users found</div>;
    }

    const newUserItems = results.map((result) => ({
        user: {
            profilePic: result.image,
            fullName: result.name,
        },
        lastMessage: "Nevermind!",
        time: "8:40 AM", 
        isActive: false, 
    }));

    return (
        <div
            className={styles.searchResults}
            onClick={() => {
                setUserList((prevList) => [...newUserItems, ...prevList]);
                setSearchValue("");
            }}
        >
            {results.map((user) => (
                <div key={user._id} className={styles.searchResultItem}>
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