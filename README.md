# ZoomBa

## Inspiration

Face to face presentations are finally no more. No longer do we need to memorise a script the night before. No longer do we need to struggle to remember the words in front of everyone. No longer do we need to flunk our presentation modules.

But is that really the case? It seems like Zoom presentations are no different - it’s still a struggle to juggle both a script and a Zoom call. And it gets even worse if you have some slides to share.

That’s why ZoomBa is here. With ZoomBa, you no longer have to manage a script separately. Your tutor will no longer call you out for glancing to the side. Everything will be right before you - literally.

## What it does

ZoomBa is here to help you succeed at Zoom presentations. ZoomBa helps to display your script as captions over your Zoom call. Experience the freedom of having the script follow you, as our voice recognition algorithms move your script along at the right pace. You can also manually configure the duration of the lines, allowing you to pace yourself better in your presentations.

## How We built it

Built using Electron, ZoomBa is a beautiful cross-platform application with a seamless user experience. It also utilises Google Cloud's Speech API to enable your script to follow you, and not the other way around.

### Google Cloud Speech API Credentials

1. Install [Ansible](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html).
1. Decrypt the API key file via

   ```sh
   ansible-vault view credentials/encrypted-key.json
   ```

   Enter the password when prompted.

1. Copy the decrypted contents into `credentials/key.json`. **Do not add this file to version control.**

## Acknowledgements

This project was built on top of the [Electron React Boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate).
