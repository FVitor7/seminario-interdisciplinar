<?php
/*
if (isset($_GET['username'])) {
    $username = htmlspecialchars($_GET['username']);
    $url = "https://api.github.com/users/" . $username;
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        'User-Agent: PHP',
        'Accept: application/vnd.github+json',
        'X-GitHub-Api-Version: 2022-11-28',
    ));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $result = curl_exec($ch);
    curl_close($ch);
    echo $result;
}
*/

if (!file_exists(__DIR__ . '/tmp')) {
    mkdir(__DIR__ . '/tmp');
}


if (isset($_GET['username'])) {
    $username = htmlspecialchars($_GET['username']);
    $cache_file = __DIR__ . "/tmp/{$username}.json";
    $cache_time = 3600; // Tempo de expiração do cache em segundos (1 hora)

    // Verifica se o arquivo de cache existe e se ainda é válido
    if (file_exists($cache_file) && (time() - filemtime($cache_file)) < $cache_time) {
        // Lê os dados do cache
        $result = file_get_contents($cache_file);
    } else {
        // Faz a solicitação à API do GitHub
        $url = "https://api.github.com/users/" . $username;
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'User-Agent: PHP',
            'Accept: application/vnd.github+json',
            'X-GitHub-Api-Version: 2022-11-28',
        ));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $result = curl_exec($ch);
        curl_close($ch);

        if ($result !== false) {
            // Armazena o resultado no cache
            if (!is_dir(__DIR__ . '/tmp')) {
                mkdir(__DIR__ . '/tmp', 0755, true);
            }
            file_put_contents($cache_file, $result);
        } else {
            echo json_encode(array('error' => 'Unable to retrieve data'));
            exit;
        }
    }

    // Decodifica os dados JSON e extrai os campos desejados
    $data = json_decode($result, true);
    $filtered_data = array(
        'avatar_url' => $data['avatar_url'],
        'html_url' => $data['html_url'],
        'name' => $data['name'],
        'blog' => $data['blog'],
        'location' => $data['location'],
        'bio' => $data['bio'],
        'public_repos' => $data['public_repos'],
    );

    // Retorna os dados filtrados como JSON
    echo json_encode($filtered_data);
}
?> 


