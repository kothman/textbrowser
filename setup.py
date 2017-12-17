from setuptools import setup, find_packages


setup(
    name='TextBrowser',
    version='0.1',
    author='Adrian Kothman',
    author_email='adrian@kothman.io',
    packages=find_packages(),
    install_requires=['bs4'],
    scripts='server.py',
    license='MIT',
    long_description=open('readme.md').read()
)
