# coding=utf-8
import os

from fabric.api import env
from fabric.context_managers import cd
from fabric.decorators import roles
from fabric.operations import run, local, put

env.roledefs['master'] = ['{{ project_name }}@xxx.xxx.xxx.xxx']


def _production_env():
    # Speedup connection setup to server.
    env.disable_known_hosts = True

    env.key_filename = [os.path.join(os.environ['HOME'], '.ssh', 'id_rsa')]
    env.project_root = '~/app/'


@roles('master')
def build(only=False):
    if not only or only == 'app':
        local('docker build -f docker/production/Dockerfile -t {{ project_name }}/projects:{{ project_name }}-app .')
        local('docker push {{ project_name }}/projects:{{ project_name }}-app')


@roles('master')
def deploy():
    _production_env()

    with cd(env.project_root):
        put('docker/production/docker-compose.yml', '~/app/')

        run('docker-compose pull')
        run('docker-compose up -d')


@roles('master')
def clear_cache():
    _production_env()

    with cd(env.project_root):
        run('docker-compose exec --rm manage clear_cache')
