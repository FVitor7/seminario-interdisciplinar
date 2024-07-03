$(document).ready(function() {
    $("#githubContent, #userNotFound").hide().removeClass('d-none');
});

document.getElementById('userForm').addEventListener('submit', function(event) {
    event.preventDefault();
    $("#githubContent").hide();
    const username = document.getElementById('usernameInput').value;
    
    fetch(`api/getUser.php?username=${username}`)
        .then(response => {
            if (response.status === 404) {
                showUserNotFound();
                return null;
            }
            return response.json();
        })
        .then(data => {
            if (data?.user) {
                showUserData(data.user);
                showUserRepos(data.repos);
            }
        })
        .catch(error => {
            console.error('Erro ao buscar informações:', error);
        });
});

function showUserNotFound() {
    $("#githubContent, #githubAvatar, #githubBio, #githubName, #githubBlog, #githubPage, #githubLocation, #githubCountRepos").hide();
    $("#reposTable").html('<tr><td colspan="5">Nenhum repositório encontrado.</td></tr>');
    $("#userNotFound").show();
}

function showUserData(user) {
    $("#userNotFound").hide();
    $("#githubContent").show();

    setElementVisibility("#githubAvatar", user.avatar_url, 'src');
    setElementVisibility("#githubBio", user.bio, 'html', `Bio: ${user.bio}`);
    setElementVisibility("#githubName", user.name, 'html', `Nome: ${user.name}`);
    setElementVisibility("#githubBlog", user.blog, 'attr', 'href');
    setElementVisibility("#githubPage", user.html_url, 'attr', 'href');
    setElementVisibility("#githubLocation", user.location, 'html', `Localização: ${user.location}`);
    setElementVisibility("#githubCountRepos", user.public_repos, 'html', `Quantidade de Repositórios: ${user.public_repos}`);
}

function setElementVisibility(selector, value, method, attributeOrHtml) {
    if (value) {
        if (method === 'attr') {
            $(selector).attr(attributeOrHtml, value).show();
        } else if (method === 'html') {
            $(selector).html(attributeOrHtml).show();
        } else if (method === 'src') {
            $(selector).attr('src', value).show();
        }
    } else {
        $(selector).hide();
    }
}

function showUserRepos(repos) {
    const reposHtml = repos.map(repo => `
        <tr>
            <td>${repo.name}</td>
            <td>${getIcon(repo.language)} <strong>${repo.language || '-'}</strong></td>
            <td>${repo.stargazers_count} estrelas</td>
            <td><a href="${repo.html_url}">Ver no GitHub</a></td>
            <td>${repo.description || '-'}</td>
        </tr>
    `).join('');
    $("#reposTable").html(reposHtml);
}

function getIcon(language) {
    const icons = {
        'JavaScript': '<i class="fab fa-js fa-lg me-1"></i>',
        'PHP': '<i class="fab fa-php fa-lg me-1"></i>',
        'HTML': '<i class="fab fa-html5 fa-lg me-1"></i>',
        'CSS': '<i class="fab fa-css3-alt fa-lg me-1"></i>',
        'Python': '<i class="fab fa-python fa-lg me-1"></i>',
        'Java': '<i class="fab fa-java fa-lg me-1"></i>',
        'C#': '<i class="fab fa-microsoft fa-lg me-1"></i>',
        'C++': '<i class="fab fa-cuttlefish fa-lg me-1"></i>',
        'C': '<i class="fab fa-cuttlefish fa-lg me-1"></i>',
        'Ruby': '<i class="fas fa-gem fa-lg me-1"></i>',
        'Shell': '<i class="fas fa-terminal fa-lg me-1"></i>',
        'TypeScript': '<i class="fas fa-terminal fa-lg me-1"></i>',
        'Vue': '<i class="fab fa-vuejs fa-lg me-1"></i>',
        'Go': '<i class="fa-brands fa-golang fa-lg me-1"></i>'
    };
    return icons[language] || '';
}
