CALL cd ..
CALL cd web-project
CALL npm run build
CALL cd ..
CALL cd web-project-backend
CALL RD D:\Web-project-backend\build /S /Q
CALL mkdir build
CALL xcopy D:\web-project\build D:\Web-project-backend\build /E
PAUSE

