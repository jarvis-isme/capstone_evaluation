# Group project- capstone evaluation for fpt students
## Member:
  - Nguyễn Đăng Khoa
  - Thân Thanh Duy
  - Phạm Thanh Kiên
  - Trần Văn Trí
# Technical note
## Please install docker, postgres, postman
## Don't add swagger  
## Add env variable
edit .env file with your local machine config but not commit Or config like .env file

## Running server
```
bash build.development.sh
```
## Access container 
```
docker exec -it kt2 bash
```
## kt2 name of container
## Migrate database 
```
npx sequelize-cli db:migrate
```
## Exit container command
```
exit
```

