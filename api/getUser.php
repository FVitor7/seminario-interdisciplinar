<?php
if (isset($_GET['username'])) {
    $username = htmlspecialchars($_GET['username']);
    $cache_file_user = "/tmp/{$username}.json";
    $cache_file_repos = "/tmp/{$username}_repos.json";
    $cache_time = 3600;

    function fetch_from_github($url) {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'User-Agent: PHP',
            'Accept: application/vnd.github+json',
            'X-GitHub-Api-Version: 2022-11-28',
        ));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HEADER, true);
        $result = curl_exec($ch);
        $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpcode == 404) {
            http_response_code(404);
            echo json_encode(array('error' => 'User not found'));
            exit;
        }

        if ($result === false) {
            echo json_encode(array('error' => 'Unable to retrieve data'));
            exit;
        }

        list($header, $body) = explode("\r\n\r\n", $result, 2);

        return array('httpcode' => $httpcode, 'body' => $body);
    }

    if (file_exists($cache_file_user) && (time() - filemtime($cache_file_user)) < $cache_time) {
        $result_user = file_get_contents($cache_file_user);
        $data_user = json_decode($result_user, true);
    } else {
        $url_user = "https://api.github.com/users/" . $username;
        $response_user = fetch_from_github($url_user);
        $data_user = json_decode($response_user['body'], true);

        if (!is_dir('/tmp')) {
            mkdir('/tmp', 0755, true);
        }
        file_put_contents($cache_file_user, $response_user['body']);
    }

    if (isset($data_user['message']) && $data_user['message'] == 'Not Found') {
        http_response_code(404);
        echo json_encode(array('error' => 'User not found'));
        exit;
    }

    if (file_exists($cache_file_repos) && (time() - filemtime($cache_file_repos)) < $cache_time) {
        $result_repos = file_get_contents($cache_file_repos);
    } else {
        $url_repos = "https://api.github.com/users/" . $username . "/repos";
        $response_repos = fetch_from_github($url_repos);
        $result_repos = $response_repos['body'];

        file_put_contents($cache_file_repos, $result_repos);
    }

    $repos = json_decode($result_repos, true);
    $filtered_repos = array();

    if (is_array($repos)) {
        foreach ($repos as $repo) {
            $filtered_repos[] = array(
                'name' => $repo['name'],
                'language' => $repo['language'],
                'description' => $repo['description'],
                'stargazers_count' => $repo['stargazers_count'],
                'html_url' => $repo['html_url'],
            );
        }
    }

    $filtered_user_data = array(
        'avatar_url' => $data_user['avatar_url'],
        'html_url' => $data_user['html_url'],
        'name' => $data_user['name'],
        'blog' => $data_user['blog'],
        'location' => $data_user['location'],
        'bio' => $data_user['bio'],
        'public_repos' => $data_user['public_repos'],
    );

    $response = array(
        'user' => $filtered_user_data,
        'repos' => $filtered_repos
    );

    echo json_encode($response);
}
?>
