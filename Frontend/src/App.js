import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [anomalies, setAnomalies] = useState([]);
  const [summary, setSummary] = useState(null);
  const [filteredUserId, setFilteredUserId] = useState('');
  const [sortConfig, setSortConfig] = useState(null);

  useEffect(() => {
    fetchAnomalies();
    fetchSummary();
  }, []);

  const fetchAnomalies = async () => {
    try {
      const response = await axios.get('/anomalies');
      setAnomalies(response.data.short_titles.map(post => ({ ...post, reason: 'Short Title' }))
        .concat(response.data.duplicate_titles.flatMap(user =>
          user.duplicates.map(title => ({ userId: user.userId, title, reason: 'Duplicate Title' }))
        )));
    } catch (error) {
      console.error('Error fetching anomalies:', error);
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await axios.get('/summary');
      setSummary(response.data);
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedAnomalies = React.useMemo(() => {
    if (!sortConfig) return anomalies;
    const sorted = [...anomalies].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [anomalies, sortConfig]);

  const filteredAnomalies = filteredUserId
    ? sortedAnomalies.filter((a) => a.userId.toString() === filteredUserId)
    : sortedAnomalies;

  return (
    <div className="App">
      <header>
        <h1>Ad Insights Dashboard</h1>
      </header>

      <main>
        <section>
          <h2>Anomalies</h2>
          <div>
            <label htmlFor="userIdFilter">Filter by User ID:</label>
            <input
              id="userIdFilter"
              type="text"
              value={filteredUserId}
              onChange={(e) => setFilteredUserId(e.target.value)}
              placeholder="Enter User ID"
            />
          </div>
          <table>
            <thead>
              <tr>
                <th onClick={() => handleSort('userId')}>User ID</th>
                <th onClick={() => handleSort('ID')}>Post ID</th>
                <th onClick={() => handleSort('title')}>Title</th>
                <th onClick={() => handleSort('reason')}>Reason</th>
              </tr>
            </thead>
            <tbody>
              {filteredAnomalies.map((anomaly, index) => (
                <tr key={index}>
                  <td>{anomaly.userId}</td>
                  <td>{anomaly.id}</td>
                  <td>{anomaly.title}</td>
                  <td>{anomaly.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section>
          <h2>Summary</h2>
          {summary && (
            <div>
              <h3>Top Users</h3>
              <ol>
                {summary.top_users.map(([userId, uniqueWords]) => (
                  <li key={userId}>User {userId}: {uniqueWords} unique words</li>
                ))}
              </ol>
              <h3>Most Common Words</h3>
              <div className="tag-cloud-container">
                <ul className="tag-cloud">
                    {summary.most_common_words.map(([word, count], index) => (
                    <li key={index} title={`Used ${count} times`} >{word}</li>
                    ))}
                </ul>
              </div>
            </div>
          )}
        </section>
      </main>
      <footer style={{ textAlign: 'center', padding: '1rem', marginTop: '2rem', backgroundColor: '#343a40', color: 'white' }}>
        &copy; Protected 2025 Ad Insights Dashboard.
        </footer>
    </div>
  );
};



export default App;
