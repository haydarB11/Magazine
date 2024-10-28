const fs = require('fs');
const path = require('path');
const JsonResponse = require('../../util/JsonResponse');
const HttpConstant = require('../../constants/HttpConstant');
const i18next = require("../../util/i18n/config");
const logsDirectory = path.join(__dirname, '../../', 'logs');

class LoggerController {

    index = async (req, res, next) => {
        try {
            console.log(logsDirectory);
            
            fs.readdir(logsDirectory, (err, files) => {
                if (err) {
                    next(err)
                }
                const logFiles = files.filter(file => file.endsWith('.log'));
                return JsonResponse.success(res, logFiles);
            });
        } catch (error) {
            next(error)
        }
    };

    read = async (req, res, next) => {
        try {    
            const fileContent = fs.readFileSync(req.filePath, 'utf-8');
            
            const jsonObjects = fileContent
                .split('\n')
                .filter(line => line.trim())
                .map(line => {
                    try {
                        return JSON.parse(line);
                    } catch (err) {
                        next(err)
                    }
                });

                return JsonResponse.success(res, jsonObjects);

        } catch (error) {
            next(error)
        }
    };

    download = async (req, res, next) => {
        try {    
            res.download(req.filePath, (err) => {
                if (err) {
                    next(err)
                }
            });
        } catch (error) {
            next(error)
        }
    };

    delete = async (req, res, next) => {
        try {
            fs.unlink(req.filePath, (err) => {
                if (err) {
                    next(err)
                }
                return JsonResponse.success(res, jsonObject, i18next.t("delete_message", { field: "Logger" }), HttpConstant.OK);
            });
        } catch (error) {
            next(error)
        }
    };

}

module.exports = new LoggerController();