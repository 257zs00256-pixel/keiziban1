const http = require('http');
const querystring = require('querystring');

const posts = [];

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const server = http.createServer((req, res) => {

  if (req.method === 'GET') {

    let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>掲示板</title>
      <style>
        body {
          font-family: sans-serif;
          max-width: 800px;
          margin: 30px auto;
        }
        textarea {
          width: 100%;
          height: 100px;
        }
        input {
          width: 300px;
        }
        .post {
          border: 1px solid #ccc;
          padding: 10px;
          margin: 10px 0;
        }
      </style>
    </head>
    <body>

      <h1>Node.js掲示板</h1>

      <form method="POST">
        <p>名前</p>
        <input type="text" name="name" required>

        <p>内容</p>
        <textarea name="message" required></textarea>

        <br><br>
        <button type="submit">投稿</button>
      </form>

      <hr>

      <h2>投稿一覧 (${posts.length}件)</h2>
    `;

    posts.forEach(post => {
      html += `
      <div class="post">
        <strong>${escapeHtml(post.name)}</strong>
        <small>${post.date}</small>
        <p>${escapeHtml(post.message)}</p>
      </div>
      `;
    });

    html += `
    </body>
    </html>
    `;

    res.writeHead(200, {
      'Content-Type': 'text/html; charset=UTF-8'
    });
    res.end(html);

  } else if (req.method === 'POST') {

    let body = '';

    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', () => {

      const data = querystring.parse(body);

      if (
        data.name &&
        data.message &&
        data.name.trim() !== '' &&
        data.message.trim() !== ''
      ) {
        posts.unshift({
          name: data.name,
          message: data.message,
          date: new Date().toLocaleString('ja-JP')
        });
      }

      res.writeHead(302, {
        Location: '/'
      });

      res.end();
    });
  }

});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log('サーバー起動');
  console.log(`Server running on ${PORT}`);
});
