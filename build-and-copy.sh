#!/bin/bash

# Ścieżki
FRONTEND_PATH="./frontend"
BUILD_PATH="$FRONTEND_PATH/build"
WWWROOT_PATH="./wwwroot"

# Budowanie aplikacji React
echo "Budowanie aplikacji React..."
cd $FRONTEND_PATH
npm run build
cd ..

# Usuwanie istniejących plików w wwwroot
echo "Usuwanie istniejących plików w $WWWROOT_PATH..."
rm -rf $WWWROOT_PATH/*

# Kopiowanie nowych plików do wwwroot
echo "Kopiowanie plików do $WWWROOT_PATH..."
cp -r $BUILD_PATH/* $WWWROOT_PATH/

echo "Gotowe!"
