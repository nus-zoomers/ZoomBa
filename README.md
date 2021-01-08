# Zoomers

## Google Cloud Speech API Credentials

1. Install [Ansible](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html).
1. Decrypt the API key file via

   ```sh
   ansible-vault view credentials/encrypted-key.json
   ```

   Enter the password when prompted.

1. Copy the decrypted contents into `credentials/key.json`. **Do not add this file to version control.**

## Acknowledgements

This project was built on top of the [Electron React Boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate).
