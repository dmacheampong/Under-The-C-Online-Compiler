from flask import Flask, request
from flask_cors import CORS
from subprocess import PIPE
import os
import subprocess
import sys


app = Flask(__name__)

CORS(app)

# Route for the main page.


@app.route('/', methods=['POST'])
def run_compiler() -> str:
    # Getting code, args, and checkbox value from the form.
    form_data = request.get_json()
    code: str = form_data.get('code')
    args: str = form_data.get('args')
    checked: int = int(form_data.get('checked'))
    output = compile(code, args, checked)
    return output


def format_cmd_line_args(args: str):
    quotes = ['\'', '\"']
    formated_args = []
    arg_temp = ''
    i = 0
    while i < len(args):
        if args[i] in quotes:
            quote = args[i]
            i += 1
            while args[i] != quote:
                arg_temp += args[i]
                i += 1
            i += 1
        if args[i] == ' ':
            formated_args.append(arg_temp)
            arg_temp = ''
            i += 1
        else:
            arg_temp += args[i]
            i += 1
    if arg_temp != '':
        formated_args.append(arg_temp)
    return formated_args


def compile(code: str, args: str, checked: int) -> str:
    if not os.path.exists('main.c'):  # Creates file if it doesn't again.
        os.open('main.c', os.O_CREAT)

    fd = os.open('main.c', os.O_WRONLY)  # Opens file descriptor for writing.
    os.truncate(fd, 0)  # Truncate content to 0 bytes to avoid overwriting.
    code_bytes = str.encode(code)  # Encodes code string into bytes.
    os.write(fd, code_bytes)  # Writes to file.
    os.close(fd)  # Closes file descriptor.

    # Compiles the C program file and retrives any errors.
    compile_process = subprocess.run(
        ['gcc', '-o', 'main', '/app/main.c'], stderr=PIPE,)
    # Stores value returned by return code.
    exit_code = compile_process.returncode
    if not exit_code:  # exit_code == 0.
        if checked:  # Run with args enabled.
            formated_args = format_cmd_line_args(args)
            execute_process = subprocess.run(
                ['/app/main'] + formated_args, stdout=PIPE, stderr=PIPE)
        else:  # Run with args disabled.
            execute_process = subprocess.run(
                ['/app/main'], stdout=PIPE, stderr=PIPE)
        return execute_process.stdout.decode()
    else:  # Return error if program did not compile successfully.
        return compile_process.stderr.decode()


port = int(os.environ.get('PORT', 5000))

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=port)
