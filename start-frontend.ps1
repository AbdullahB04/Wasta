#Requires -RunAsAdministrator

Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process -Force

cd c:\Wasta\frontend

node .\node_modules\vite\bin\vite.js
