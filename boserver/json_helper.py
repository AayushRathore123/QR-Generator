class ReturnJSON(dict):
    def __init__(self):
        super().__init__()
        self["errCode"] = 0
        self["msg"] = ""
        self["data"] = []
        self["datarec"] = {}

    def set_error_msg(self, errcode, errmsg):
        if type(errmsg) != str:
            return AttributeError
        self["errCode"] = errcode
        self["msg"] = errmsg

    def set_success_msg(self, successmsg):
        if type(successmsg) != str:
            return AttributeError
        self["msg"] = successmsg
