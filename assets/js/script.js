
$("#githubContent").hide();

document.getElementById('userForm').addEventListener('submit', function(event) {
    event.preventDefault();
    $("#githubContent").hide();
    const username = document.getElementById('usernameInput').value;
    fetch('api/getUser.php?username=' + username)
        .then(response => response.json())
        .then(data => {
            if (data) {
                $("#githubContent").show();

                $("#githubAvatar").hide();
                if (data.avatar_url) {
                    $("#githubAvatar").attr("src", data.avatar_url);
                    $("#githubAvatar").show();
                }
                
                $("#githubBio").hide();
                if (data.bio) {
                    $("#githubBio").html(`Bio: ${data.bio}`);
                    $("#githubBio").show();
                }

                $("#githubName").hide();
                if (data.name) {
                    $("#githubName").html(`Nome: ${data.name}`);
                    $("#githubName").show();
                }

                $("#githubBlog").hide();
                if (data.blog) {
                    $("#githubBlog").attr('href', data.blog);
                    $("#githubBlog").show();
                }

                $("#githubPage").hide();
                if (data.blog) {
                    $("#githubPage").attr('href', data.html_url);
                    $("#githubPage").show();
                }

                $("#githubLocation").hide();
                if (data.location) {
                    $("#githubLocation").html(`Localização: ${data.location}`);
                    $("#githubLocation").show();
                }

                $("#githubCountRepos").hide();
                if (data.public_repos) {
                    $("#githubCountRepos").html(`Quantidade de Repositórios: ${data.public_repos}`);
                    $("#githubCountRepos").show();
                }

                
                
                const userInfo = `
                    <p><strong>Nome:</strong> ${data.name || 'Não disponível'}</p>
                    <p><strong>Bio:</strong> ${data.bio || 'Não disponível'}</p>
                    <p><strong>Localização:</strong> ${data.location || 'Não disponível'}</p>
                    <p><strong>Seguidores:</strong> ${data.followers}</p>
                `;
                //document.getElementById('userInfo').innerHTML = userInfo;
            }
        })
        .catch(error => {
            //document.getElementById('userInfo').innerHTML = '<p>Erro ao buscar informações.</p>';
        });
        
    fetch('api/getRepos.php?username=' + username)
        .then(response => response.json())
        .then(data => {
            if (data) {
                const repos = data.map(repo => {
                    const description = repo.description ? repo.description : '-';
                    const language = repo.language ? repo.language : '-';


                    return `
                    <tr>
                        <td>${repo.name}</td>
                        <td>${getIcon(language)} <strong>${language}</strong></td>
                        <td>${repo.stargazers_count} estrelas</td>
                        <td><a href="${repo.html_url}">Ver no github</a></td>
                        <td>${description}</td>
                    </tr>
                    `;
                }).join('');
                $("#reposTable").html(repos);
            }
        })
        .catch(error => {
            //document.getElementById('userInfo').innerHTML = '<p>Erro ao buscar informações.</p>';
        });
});

function getIcon(language) {
    switch (language) {
        case 'JavaScript':
            return '<i class="fab fa-js fa-lg me-1"></i>';
        case 'PHP':
            return '<i class="fab fa-php fa-lg me-1"></i>';
        case 'HTML':
            return '<i class="fab fa-html5 fa-lg me-1"></i>';
        case 'CSS':
            return '<i class="fab fa-css3-alt fa-lg me-1"></i>';
        case 'Python':
            return '<i class="fab fa-python fa-lg me-1"></i>';
        case 'Java':
            return '<i class="fab fa-java fa-lg me-1"></i>';
        case 'C#':
            return '<i class="fab fa-microsoft fa-lg me-1"></i>';
        case 'C++':
            return '<i class="fab fa-cuttlefish fa-lg me-1"></i>';
        case 'C':
            return '<i class="fab fa-cuttlefish fa-lg me-1"></i>';
        case 'Ruby':
            return '<i class="fas fa-gem fa-lg me-1"></i>';
        case 'Shell':
            return '<i class="fas fa-terminal fa-lg me-1"></i>';
        case 'TypeScript':
            return '<i class="fas fa-terminal fa-lg me-1"></i>';
        case 'Vue':
            return '<i class="fab fa-vuejs fa-lg me-1"></i>';
        case 'Go':
            return '<i class="fa-brands fa-golang fa-lg me-1"></i>';
        default:
            return '';
    }
}
