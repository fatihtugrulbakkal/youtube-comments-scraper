import { useState, useEffect } from 'react'
import Sentiment from 'sentiment'
import './App.css'

const sentiment = new Sentiment()

function App() {
  const [videoUrl, setVideoUrl] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [nextPageToken, setNextPageToken] = useState('')
  const [progress, setProgress] = useState('')
  const [apiQuotaUsed, setApiQuotaUsed] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [minLikes, setMinLikes] = useState(0)
  const [sortBy, setSortBy] = useState('relevance')
  const [filteredAndSortedComments, setFilteredAndSortedComments] = useState([])
  const [allComments, setAllComments] = useState([])
  const [sentimentFilter, setSentimentFilter] = useState('all')
  const [theme, setTheme] = useState('light')

  // Load API key from environment variable
  useEffect(() => {
    const envApiKey = import.meta.env.VITE_YOUTUBE_API_KEY || 'AIzaSyCbkcdeC-LHxLoslN3sYtIdXNK88UGmSZw'
    if (envApiKey) {
      setApiKey(envApiKey)
    }
  }, [])

  // Extract video ID from YouTube URL
  const extractVideoId = (url) => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/
    ]
    
    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) return match[1]
    }
    return null
  }

  // Fetch comments from YouTube API
  const fetchComments = async (videoId, pageToken = '') => {
    const url = `https://www.googleapis.com/youtube/v3/commentThreads?key=${apiKey}&videoId=${videoId}&part=snippet%2Creplies&maxResults=100&order=time&pageToken=${pageToken}`
    
    const response = await fetch(url)
    const data = await response.json()
    
    if (data.error) {
      throw new Error(data.error.message)
    }
    
    return data
  }

  // Fetch ALL comments automatically
  const fetchAllComments = async (videoId, allComments = [], pageToken = '', pageCount = 0) => {
    try {
      const data = await fetchComments(videoId, pageToken)
      
      // Handle empty results
      if (!data.items || data.items.length === 0) {
        setNextPageToken('')
        setProgress(`✓ Toplam ${allComments.length} yorum yüklendi! (Kullanılan kota: ${pageCount}, Kalan: ${(10000 - pageCount).toLocaleString('tr-TR')})`)
        return allComments
      }
      
      // Extract comments with replies
      const newComments = data.items.flatMap(item => {
        const mainComment = item.snippet.topLevelComment.snippet
        const replies = item.replies ? item.replies.comments.map(reply => ({
          ...reply.snippet,
          isReply: true,
          parentId: mainComment.id
        })) : []
        return [mainComment, ...replies]
      })
      
      allComments = [...allComments, ...newComments]
      
      // API quota: 1 unit per request, max 10,000 units/day
      const quotaUsed = pageCount + 1
      const quotaRemaining = 10000 - quotaUsed
      
      setComments([...allComments])
      setApiQuotaUsed(quotaUsed)
      setProgress(`${allComments.length} yorum yüklendi (Sayfa ${pageCount + 1}) | Kalan kota: ${quotaRemaining.toLocaleString('tr-TR')}${data.nextPageToken ? `... ${Math.ceil((pageCount + 1) * 1.2)} sayfa tahmini` : ''}`)
      
      // Continue fetching if there's a next page token
      if (data.nextPageToken && data.nextPageToken !== pageToken) {
        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100))
        return fetchAllComments(videoId, allComments, data.nextPageToken, pageCount + 1)
      } else {
        setNextPageToken('')
        setProgress(`✓ Toplam ${allComments.length} yorum başarıyla yüklendi! (Kullanılan kota: ${quotaUsed}, Kalan: ${quotaRemaining.toLocaleString('tr-TR')})`)
        return allComments
      }
    } catch (err) {
      console.error('Error fetching comments:', err)
      setProgress('')
      throw err
    }
  }

  const handleFetch = async (fetchAll = false) => {
    if (!videoUrl || !apiKey) {
      setError('Lütfen video URL ve API anahtarı girin!')
      return
    }

    const videoId = extractVideoId(videoUrl)
    if (!videoId) {
      setError('Geçersiz YouTube URL!')
      return
    }

    setLoading(true)
    setError('')
    setComments([])
    setNextPageToken('')
    setProgress('')

    try {
      if (fetchAll) {
        // Fetch ALL comments
        await fetchAllComments(videoId)
      } else {
        // Fetch only first page
        const data = await fetchComments(videoId)
        const commentsWithReplies = data.items.flatMap(item => {
          const mainComment = item.snippet.topLevelComment.snippet
          const replies = item.replies ? item.replies.comments.map(reply => ({
            ...reply.snippet,
            isReply: true,
            parentId: mainComment.id
          })) : []
          return [mainComment, ...replies]
        })
        setComments(commentsWithReplies)
        setNextPageToken(data.nextPageToken || '')
        setApiQuotaUsed(1)
        setProgress(`✓ ${data.items.length} yorum yüklendi | Kalan kota: 9,999${data.nextPageToken ? ` (daha fazla yorum var)` : ''}`)
      }
    } catch (err) {
      setError(err.message || 'Yorumlar alınırken bir hata oluştu!')
      setProgress('')
    } finally {
      setLoading(false)
    }
  }

  const handleLoadMore = async () => {
    if (!nextPageToken || loading) return

    const videoId = extractVideoId(videoUrl)
    setLoading(true)

    try {
      const data = await fetchComments(videoId, nextPageToken)
      const commentsWithReplies = data.items.flatMap(item => {
        const mainComment = item.snippet.topLevelComment.snippet
        const replies = item.replies ? item.replies.comments.map(reply => ({
          ...reply.snippet,
          isReply: true,
          parentId: mainComment.id
        })) : []
        return [mainComment, ...replies]
      })
      setComments(prev => [...prev, ...commentsWithReplies])
      setNextPageToken(data.nextPageToken || '')
    } catch (err) {
      setError(err.message || 'Daha fazla yorum yüklenirken bir hata oluştu!')
    } finally {
      setLoading(false)
    }
  }

  // Filtreleme ve sıralama
  useEffect(() => {
    if (comments.length === 0) {
      setFilteredAndSortedComments([])
      return
    }

    // Duygu analizi ekle
    const commentsWithSentiment = comments.map(comment => {
      // HTML etiketlerini temizle
      const cleanText = comment.textDisplay.replace(/<[^>]*>/g, '')
      const result = sentiment.analyze(cleanText)
      
      return {
        ...comment,
        sentiment: result.score > 0 ? 'positive' : result.score < 0 ? 'negative' : 'neutral',
        sentimentScore: result.score
      }
    })

    let filtered = [...commentsWithSentiment]

    // Arama terimi ile filtreleme
    if (searchTerm) {
      filtered = filtered.filter(comment =>
        comment.textDisplay.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comment.authorDisplayName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Minimum beğeni ile filtreleme
    if (minLikes > 0) {
      filtered = filtered.filter(comment => comment.likeCount >= minLikes)
    }

    // Duygu filtresi
    if (sentimentFilter !== 'all') {
      filtered = filtered.filter(comment => comment.sentiment === sentimentFilter)
    }

    // Sıralama
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'likes-desc':
          return b.likeCount - a.likeCount
        case 'likes-asc':
          return a.likeCount - b.likeCount
        case 'date-desc':
          return new Date(b.publishedAt) - new Date(a.publishedAt)
        case 'date-asc':
          return new Date(a.publishedAt) - new Date(b.publishedAt)
        case 'length-desc':
          return b.textDisplay.length - a.textDisplay.length
        case 'length-asc':
          return a.textDisplay.length - b.textDisplay.length
        default: // relevance
          return 0
      }
    })

    setFilteredAndSortedComments(filtered)
    setAllComments(comments)
  }, [comments, searchTerm, sortBy, minLikes, sentimentFilter])

  const exportToCSV = () => {
    if (filteredAndSortedComments.length === 0) return

    const headers = ['Yazar', 'Metin', 'Tarih', 'Beğeni']
    const rows = filteredAndSortedComments.map(comment => [
      comment.authorDisplayName,
      JSON.stringify(comment.textDisplay),
      new Date(comment.publishedAt).toLocaleDateString('tr-TR'),
      comment.likeCount
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `youtube-yorumlari-${Date.now()}.csv`
    link.click()
  }

  const exportToJSON = () => {
    if (filteredAndSortedComments.length === 0) return

    const data = filteredAndSortedComments.map(comment => ({
      yazar: comment.authorDisplayName,
      metin: comment.textDisplay,
      tarih: comment.publishedAt,
      begeni: comment.likeCount,
      cevaplar: comment.totalReplyCount || 0,
      profilResmi: comment.authorProfileImageUrl
    }))

    const jsonContent = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonContent], { type: 'application/json' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `youtube-yorumlari-${Date.now()}.json`
    link.click()
  }

  return (
    <div className={`app theme-${theme}`}>
      <div className="container">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
          <h1 style={{margin: 0}}>🎥 YouTube Yorum Çekme Aracı</h1>
          <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
            <label htmlFor="theme-select" style={{fontSize: '14px', fontWeight: '600'}}>🎨 Tema:</label>
            <select
              id="theme-select"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '14px',
                cursor: 'pointer',
                background: 'white'
              }}
            >
              <option value="light">🌞 Açık</option>
              <option value="dark">🌙 Koyu</option>
              <option value="blue">💙 Mavi</option>
              <option value="green">💚 Yeşil</option>
              <option value="purple">💜 Mor</option>
              <option value="pink">💗 Pembe</option>
            </select>
          </div>
        </div>
        
        <div className="input-section">
          <div className="input-group">
            <label htmlFor="videoUrl">Video URL:</label>
            <input
              id="videoUrl"
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>

          <div style={{display: 'flex', gap: '10px'}}>
            <button onClick={() => handleFetch(false)} disabled={loading} style={{flex: 1}}>
              {loading ? 'Yükleniyor...' : 'İlk 100 Yorumu Çek'}
            </button>
            <button onClick={() => handleFetch(true)} disabled={loading} className="fetch-all-btn" style={{flex: 1}}>
              {loading ? 'Tüm Yorumlar Yükleniyor...' : '📥 TÜM Yorumları Çek'}
            </button>
          </div>
        </div>

        {error && <div className="error">{error}</div>}
        
        {loading && (
          <div style={{
            background: '#2196f3',
            color: 'white',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            <div style={{fontSize: '16px', fontWeight: '600', marginBottom: '8px'}}>
              {progress || 'Yorumlar yükleniyor...'}
            </div>
            {apiQuotaUsed > 0 && (
              <div style={{fontSize: '12px', opacity: 0.9}}>
                📊 Kullanılan: {apiQuotaUsed.toLocaleString('tr-TR')} / 10,000 (Kalan: {(10000 - apiQuotaUsed).toLocaleString('tr-TR')})
              </div>
            )}
          </div>
        )}
        
        {progress && !loading && (
          <div style={{
            background: '#4caf50',
            color: 'white',
            padding: '10px 15px',
            borderRadius: '8px',
            marginBottom: '20px',
            textAlign: 'center',
            fontSize: '14px'
          }}>
            {progress}
          </div>
        )}

        {comments.length > 0 && (
          <div className="results-section">
            <div className="results-header">
              <h2>Yorumlar ({filteredAndSortedComments.length} / {allComments.length})</h2>
              <div style={{display: 'flex', gap: '10px'}}>
                <button onClick={exportToCSV} className="export-btn-csv">
                  📊 CSV İndir
                </button>
                <button onClick={exportToJSON} className="export-btn-json">
                  📄 JSON İndir
                </button>
              </div>
            </div>

            {/* İstatistik Panel */}
            <div className="stats-panel">
              <h3>📊 İstatistikler</h3>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-value">{allComments.length}</div>
                  <div className="stat-label">Toplam Yorum</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">
                    {allComments.length > 0 
                      ? Math.round(allComments.reduce((acc, c) => acc + c.likeCount, 0) / allComments.length)
                      : 0
                    }
                  </div>
                  <div className="stat-label">Ort. Beğeni</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">
                    {allComments.length > 0 
                      ? Math.max(...allComments.map(c => c.likeCount))
                      : 0
                    }
                  </div>
                  <div className="stat-label">En Çok Beğeni</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{new Set(allComments.map(c => c.authorDisplayName)).size}</div>
                  <div className="stat-label">Farklı Yazarlar</div>
                </div>
                {/* Duygu Analizi İstatistikleri */}
                {filteredAndSortedComments.length > 0 && (
                  <>
                    <div className="stat-card" style={{background: 'rgba(76, 175, 80, 0.2)'}}>
                      <div className="stat-value" style={{color: '#4caf50'}}>
                        {filteredAndSortedComments.filter(c => c.sentiment === 'positive').length}
                      </div>
                      <div className="stat-label">😊 Pozitif</div>
                    </div>
                    <div className="stat-card" style={{background: 'rgba(255, 152, 0, 0.2)'}}>
                      <div className="stat-value" style={{color: '#ff9800'}}>
                        {filteredAndSortedComments.filter(c => c.sentiment === 'neutral').length}
                      </div>
                      <div className="stat-label">😐 Nötr</div>
                    </div>
                    <div className="stat-card" style={{background: 'rgba(244, 67, 54, 0.2)'}}>
                      <div className="stat-value" style={{color: '#f44336'}}>
                        {filteredAndSortedComments.filter(c => c.sentiment === 'negative').length}
                      </div>
                      <div className="stat-label">😞 Negatif</div>
                    </div>
                    <div className="stat-card" style={{background: 'rgba(156, 39, 176, 0.2)'}}>
                      <div className="stat-value" style={{color: '#9c27b0', fontSize: '1.3rem'}}>
                        {filteredAndSortedComments.length > 0 
                          ? (filteredAndSortedComments.reduce((acc, c) => acc + (c.sentimentScore || 0), 0) / filteredAndSortedComments.length).toFixed(1)
                          : '0.0'
                        }
                      </div>
                      <div className="stat-label">⭐ Ort. Duygu Skoru</div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Filtreleme ve Sıralama */}
            <div className="filter-sort-section">
              <div className="filter-group">
                <label>🔍 Arama:</label>
                <input
                  type="text"
                  placeholder="Yorum veya yazar ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="filter-input"
                />
              </div>

              <div className="filter-group">
                <label>👍 Min Beğeni:</label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={minLikes}
                  onChange={(e) => setMinLikes(parseInt(e.target.value) || 0)}
                  className="filter-input"
                />
              </div>

              <div className="filter-group">
                <label>📊 Sırala:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="filter-select"
                >
                  <option value="relevance">İlişki</option>
                  <option value="likes-desc">En Çok Beğenilenler</option>
                  <option value="likes-asc">En Az Beğenilenler</option>
                  <option value="date-desc">En Yeni</option>
                  <option value="date-asc">En Eski</option>
                  <option value="length-desc">En Uzun</option>
                  <option value="length-asc">En Kısa</option>
                </select>
              </div>
              <div className="filter-group">
                <label>😊 Duygu:</label>
                <select
                  value={sentimentFilter}
                  onChange={(e) => setSentimentFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">Tümü</option>
                  <option value="positive">😊 Pozitif</option>
                  <option value="neutral">😐 Nötr</option>
                  <option value="negative">😞 Negatif</option>
                </select>
              </div>
            </div>

            <div className="comments-list">
              {filteredAndSortedComments.map((comment, index) => (
                <div key={index} className="comment-card" style={comment.isReply ? {marginLeft: '30px', background: '#f0f0f0', borderLeft: '3px solid #667eea'} : {}}>
                  {comment.isReply && <div style={{fontSize: '12px', color: '#667eea', fontWeight: '600', marginBottom: '8px'}}>↳ Yanıt</div>}
                  <div className="comment-author">
                    <img src={comment.authorProfileImageUrl} alt={comment.authorDisplayName} />
                    <div>
                      <strong>{comment.authorDisplayName}</strong>
                      <span className="comment-date">
                        {new Date(comment.publishedAt).toLocaleDateString('tr-TR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                  {/* Duygu Etiketi */}
                  {comment.sentiment && (
                    <div style={{display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap'}}>
                      <div style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        marginBottom: '8px',
                        background: comment.sentiment === 'positive' ? 'rgba(76, 175, 80, 0.1)' : 
                                    comment.sentiment === 'negative' ? 'rgba(244, 67, 54, 0.1)' : 
                                    'rgba(255, 152, 0, 0.1)',
                        color: comment.sentiment === 'positive' ? '#4caf50' : 
                               comment.sentiment === 'negative' ? '#f44336' : '#ff9800',
                        border: `1px solid ${comment.sentiment === 'positive' ? '#4caf50' : 
                                              comment.sentiment === 'negative' ? '#f44336' : '#ff9800'}`
                      }}>
                        {comment.sentiment === 'positive' && '😊 Pozitif'}
                        {comment.sentiment === 'negative' && '😞 Negatif'}
                        {comment.sentiment === 'neutral' && '😐 Nötr'}
                      </div>
                      {/* Duygu Skoru Göstergesi */}
                      {comment.sentimentScore !== undefined && (
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: '600',
                          background: 'rgba(156, 39, 176, 0.1)',
                          color: '#9c27b0',
                          border: '1px solid #9c27b0',
                          marginBottom: '8px'
                        }}>
                          <span>⭐</span>
                          <span style={{fontFamily: 'monospace'}}>
                            {comment.sentimentScore > 0 ? '+' : ''}{comment.sentimentScore}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="comment-text" dangerouslySetInnerHTML={{ __html: comment.textDisplay }} />
                  <div className="comment-meta">
                    👍 {comment.likeCount} • {comment.totalReplyCount > 0 && !comment.isReply && `${comment.totalReplyCount} cevap`}
                  </div>
                </div>
              ))}
            </div>

            {nextPageToken && (
              <button onClick={handleLoadMore} className="load-more-btn">
                Daha Fazla Yorum Yükle
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
