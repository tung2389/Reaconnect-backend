CALL cd ..
CALL cd web-project1
CALL npm run build
CALL cd ..
CALL cd web-project1-backend
CALL RD D:\Web-project1-backend\build /S /Q
CALL mkdir build
CALL xcopy D:\web-project1\build D:\Web-project1-backend\build /E
PAUSE

