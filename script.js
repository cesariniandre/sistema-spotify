// script.js
const clientID = '3e0dd11278a14e6da89f705cceff4650'; // Substitua pelo seu Client ID
const redirectURI = 'http://localhost:3000/callback'; // Substitua pela URL de callback registrada na sua aplicação do Spotify
const scope = 'album:read'; // Permissões necessárias para buscar detalhes do álbum

function authenticateSpotify() {
  const spotifyUrl = document.getElementById('spotifyUrl').value;

  // Redireciona para a página de autenticação do Spotify
  window.location.href = `https://accounts.spotify.com/authorize?response_type=token&client_id=${clientID}&scope=${encodeURIComponent(scope)}&redirect_uri=${encodeURIComponent(redirectURI)}&state=${encodeURIComponent(spotifyUrl)}`;
}

// Função para extrair o token de acesso da URL após a autenticação
function getAccessToken() {
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);

  return params.get('access_token');
}

// Função para buscar a capa do álbum usando o token de acesso
async function fetchAlbumCover() {
  const accessToken = getAccessToken();
  const spotifyUrl = decodeURIComponent(window.location.search.split('?url=')[1]);

  // Extrai o ID do álbum da URL inserida
  const albumId = spotifyUrl.split('/').pop();

  try {
    // Faz a solicitação para a API do Spotify para buscar os detalhes do álbum
    const response = await fetch(`https://api.spotify.com/v1/albums/${albumId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    // Verifica se a resposta possui a URL da imagem da capa do álbum
    if (response.status === 200 && data.images && data.images.length > 0) {
      const imageUrl = data.images[0].url;
      document.getElementById('albumCover').innerHTML = `<img src="${imageUrl}" alt="Capa do Álbum">`;
    } else {
      document.getElementById('albumCover').innerHTML = 'Não foi possível encontrar a capa do álbum.';
    }
  } catch (error) {
    document.getElementById('albumCover').innerHTML = 'Ocorreu um erro ao buscar a capa do álbum.';
  }
}

// Verifica se há um token de acesso na URL após a autenticação e busca a capa do álbum
window.onload = function() {
  if (window.location.hash.includes('access_token')) {
    fetchAlbumCover();
  }
};
