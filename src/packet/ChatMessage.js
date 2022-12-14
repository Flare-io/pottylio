class ChatMessage {
    constructor(sender, message) {
        this.sender = sender;
        this.message = message;
    }
    build(protocol) {
        var text = this.message;
        if (text == null)
            text = "";

        var name = "SERVER";
        var color = { 'r': 0x9B, 'g': 0x9B, 'b': 0x9B };
        var nameColor = { r: 0xFF, g: 0xFF, b: 0xFF };
        if (this.sender != null) {
            name = this.sender._name;
            if (name == null || name.length == 0) {
                if (this.sender.cells.length > 0)
                    name = "An unnamed cell";
                else
                    name = "Spectator";
            }
            if (this.sender.cells.length > 0) {
                color = this.sender.cells[0].color;
                nameColor = this.sender.nameColor;
            }
        }

        var UserRoleEnum = require("../enum/UserRoleEnum");
        var BinaryWriter = require("./BinaryWriter");
        var writer = new BinaryWriter();
        writer.writeUInt8(0x63); // message id (decimal 99)

        // flags
        var flags = 0;
        if (this.sender == null)
            flags = 0x80; // server message
        else if (this.sender.userRole == UserRoleEnum.ADMIN)
            flags = 0x40; // admin message
        else if (this.sender.userRole == UserRoleEnum.MODER)
            flags = 0x20; // moder message
        if (this.sender && this.sender.socket && this.sender.socket.info && this.sender.socket.info.nick && name && name.toLowerCase() === this.sender.socket.info.nick.toLowerCase())
            flags |= 0x10;
        writer.writeUInt8(flags);
        writer.writeUInt8(color.r >> 0);
        writer.writeUInt8(color.g >> 0);
        writer.writeUInt8(color.b >> 0);

        if (protocol < 6) {
            writer.writeStringZeroUnicode(name);
            writer.writeStringZeroUnicode(text);
        } else {
            writer.writeStringZeroUtf8(name);
            writer.writeStringZeroUtf8(text);
        }
        writer.writeUInt8(nameColor.r);
        writer.writeUInt8(nameColor.g);
        writer.writeUInt8(nameColor.b);
        return writer.toBuffer();
    };
};

module.exports = ChatMessage;